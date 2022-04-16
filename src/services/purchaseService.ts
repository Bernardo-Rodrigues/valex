import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as cardRepository from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import Forbidden from "../errors/BadRequestError.js";
import BadRequest from "../errors/BadRequestError.js";
import Unauthorized from "../errors/UnauthorizedError.js";

export async function makePurchase(purchaseInfo: any){
    const { cardId, businessId, amount, password } = purchaseInfo

    const card = await validateCardExistence(cardId)

    await validatePurchase(password, card, purchaseInfo)

    await paymentRepository.insert({cardId, businessId, amount})
}

export async function makeOnlinePurchase(purchaseInfo: any){
    const { number, name, expirationDate, CVC, businessId, amount } = purchaseInfo

    const card = await validateCardForOnlinePurchase(number, name, expirationDate)

    await validatePurchase(CVC, card, purchaseInfo)

    await paymentRepository.insert({cardId:card.id, businessId, amount})
}

async function validateBusiness(id: number, card: any){
    const business = await businessRepository.findById(id);
    if(!business) throw new NotFound("Business not found")
    if(business.type !== card.type) throw new Forbidden("Invalid card type")
}

async function validateCardForOnlinePurchase(number: string, name: string, expirationDate: any) {
    const card = await cardRepository.findByCardDetails(number, name, expirationDate);
    if(!card) throw new NotFound("Card not registered")

    return {
        ...card,
        id: card.isVirtual ? card.originalCardId : card.id
    }
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

async function validateCardBalance(paymentInfo:any) {
    const [ totalRecharges, totalPayments ] = await cardRepository.getTotalOfTransactions(paymentInfo.cardId)
    const balance = totalRecharges.value - totalPayments.value
    if(balance < paymentInfo.amount) throw new BadRequest("Insufficient balance")
}

async function validatePurchase(auth: string, card: any, purchaseInfo: any){
    if(auth.length === 3) if(!bcrypt.compareSync(auth, card.securityCode)) throw new Unauthorized("CVC is wrong")
    else if(!bcrypt.compareSync(auth, card.password)) throw new Unauthorized("Password is wrong")

    await validateCardExpired(card.expirationDate)

    if(card.isBlocked) throw new Forbidden("Blocked card")

    await validateBusiness(purchaseInfo.businessId, card)

    await validateCardBalance(purchaseInfo)
}