import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import Conflict from "../errors/ConflictError.js";
import { formatEmployeeName } from "../utils/formatEmployeeName.js";
import Unauthorized from "../errors/UnauthorizedError.js";

export async function createCard(newCard: any){
    const employee = await employeeRepository.findById(newCard.employeeId);
    if(!employee) throw new NotFound("Employee not found")

    const sameTypeCard = await cardRepository.findByTypeAndEmployeeId(newCard.cardType, newCard.employeeId)
    if(sameTypeCard) throw new Conflict("Employee already has a card of this type")

    const cardNumber = faker.finance.creditCardNumber('mastercard')
    const securityCode = faker.finance.creditCardCVV()
    const hashedSecurityCode = bcrypt.hashSync(securityCode, 12);
    const expirationDate = dayjs().add(5, "year").format("MM/YY")
    const cardholderName = formatEmployeeName(employee.fullName)

    const id = await cardRepository.insert({
        employeeId: newCard.employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: hashedSecurityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type: newCard.cardType

    })

    return {id, securityCode};
}

export async function activateCard(cardInfo: any){
    const card = await cardRepository.findById(cardInfo.cardId);
    if(!card) throw new NotFound("Card not registered")

    const formatedExpirationDate = `${card.expirationDate.split("/")[0]}/01/${card.expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new Unauthorized("Card is expired")

    if(card.password) throw new Unauthorized("Card has already been activated")

    if(!bcrypt.compareSync(cardInfo.CVC, card.securityCode)) throw new Unauthorized("CVC is wrong")

    const hashedPassword = bcrypt.hashSync(cardInfo.cardPassword, 12);

    await cardRepository.update(cardInfo.cardId, {...card, password:hashedPassword});
}

export async function rechargeCard(cardId: any, amount: number){
    const card = await cardRepository.findById(cardId);
    if(!card) throw new NotFound("Card not registered")

    const formatedExpirationDate = `${card.expirationDate.split("/")[0]}/01/${card.expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new Unauthorized("Card is expired")

    await rechargeRepository.insert({cardId, amount});
}

export async function makePayment(paymentInfo: any){
    const card = await cardRepository.findById(paymentInfo.cardId);
    if(!card) throw new NotFound("Card not registered")

    const formatedExpirationDate = `${card.expirationDate.split("/")[0]}/01/${card.expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new Unauthorized("Card is expired")

    if(!bcrypt.compareSync(paymentInfo.password, card.password)) throw new Unauthorized("Password is wrong")

    const business = await businessRepository.findById(paymentInfo.businessId)
    if(!business) throw new NotFound("Business not registered")

    if(business.type !== card.type) throw new Unauthorized("Invalid transaction")

    const [ recharges, payments ] = await cardRepository.getBalance(paymentInfo.cardId)
    const balance = recharges.value - payments.value
    if(balance < paymentInfo.amount) throw new Unauthorized("Insufficient balance")

    await paymentRepository.insert({cardId:paymentInfo.cardId, businessId:paymentInfo.businessId, amount:paymentInfo.amount})
}