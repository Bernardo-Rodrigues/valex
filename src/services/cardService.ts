import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import Conflict from "../errors/ConflictError.js";
import { formatEmployeeName } from "../utils/formatEmployeeName.js";
import BadRequest from "../errors/BadRequestError.js";
import { TransactionTypes } from "../repositories/cardRepository.js";
import generateCardInfo from "../utils/generateCardInfo.js";
import Forbidden from "../errors/ForbiddenError.js";
import Unauthorized from "../errors/UnauthorizedError.js";
import formatMetrics from "../utils/formatMetrics.js";

export async function createCard(newCard: any){
    await validateCardType(newCard.cardType, newCard.employeeId)
    const employeeName = await validateEmployee(newCard.employeeId)
    const cardholderName = formatEmployeeName(employeeName)
    const { number, securityCode, expirationDate } = generateCardInfo()

    await cardRepository.insert({
        employeeId: newCard.employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: newCard.cardType
    })
}

export async function getMetrics(cardId: any){
    await validateCardExistence(cardId)
    
    const recharges = await rechargeRepository.findByCardId(cardId)
    const transactions = await paymentRepository.findByCardId(cardId)
    const balance = await getBalance(cardId)
    const metrics = formatMetrics({balance, transactions, recharges})
    
    return metrics
}

export async function activateCard(cardInfo: any){
    const card = await validateNonVirtualCard(cardInfo.cardId, "Only non-virtual cards must be activated")
    if(card.password) throw new BadRequest("Card has already been activated")
    
    if(!bcrypt.compareSync(cardInfo.CVC, card.securityCode)) throw new Unauthorized("CVC is wrong")
    
    const hashedPassword = bcrypt.hashSync(cardInfo.cardPassword, 12);
    
    await cardRepository.update(cardInfo.cardId, {...card, password:hashedPassword});
}


export async function rechargeCard(cardId: any, amount: number){
    await validateNonVirtualCard(cardId, "Virtual cards should not be recharged")
    await rechargeRepository.insert({cardId, amount});
}

export async function unlockCard(cardInfo: any){
    await blockOrUnlockCard("unlock", cardInfo);
}

export async function blockCard(cardInfo: any){
    await blockOrUnlockCard("block", cardInfo);
}

async function validateEmployee(id: number){
    const employee = await employeeRepository.findById(id);
    if(!employee) throw new NotFound("Employee not found")
    
    return employee.fullName
}

async function validateCardType(type: TransactionTypes, employeeId: number) {
    const sameTypeCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    if(sameTypeCard) throw new Conflict("Employee already has a card of this type")
}

async function validateCardExistence(cardId: number){
    const card = await cardRepository.findById(cardId);
    if(!card) throw new NotFound("Card not registered")
    
    return card
}

async function validateCardExpired(expirationDate: any){
    const formatedExpirationDate = `${expirationDate.split("/")[0]}/01/${expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new BadRequest("Card is expired")
}

async function validateNonVirtualCard(cardId: number, message: string){
    const card = await validateCardExistence(cardId)
    
    await validateCardExpired(card.expirationDate)
    
    if(card.isVirtual) throw new Forbidden(message)

    return card
}

async function getBalance(cardId: number){
    const [ totalRecharges, totalPayments ] = await cardRepository.getTotalOfTransactions(cardId)
    return totalRecharges.value - totalPayments.value
}

async function blockOrUnlockCard(option: string, cardInfo:any){
    const card = await validateCardExistence(cardInfo.cardId)
    console.log(option)

    if(!bcrypt.compareSync(cardInfo.cardPassword, card.password)) throw new Unauthorized("Password is wrong")
    
    await validateCardExpired(card.expirationDate)
    
    switch(option){
        case "block": {
            if(card.isBlocked) throw new BadRequest("Card already blocked")
            await cardRepository.update(cardInfo.cardId, {...card, isBlocked: true})
        }; 
        case "unlock": {
            if(!card.isBlocked) throw new BadRequest("Card already unlocked")
            await cardRepository.update(cardInfo.cardId, {...card, isBlocked: false})
        };
        default: break;
    }
    
}