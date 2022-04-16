import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as cardRepository from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import Unauthorized from "../errors/UnauthorizedError.js";
import Forbidden from "../errors/ForbiddenError.js";

export async function makePurchase(paymentInfo: any){
    const card = await cardRepository.findById(paymentInfo.cardId);
    if(!card) throw new NotFound("Card not registered")

    if(card.isVirtual) throw new Forbidden("Virtual cards cannot be used for POS purchases")

    const formatedExpirationDate = `${card.expirationDate.split("/")[0]}/01/${card.expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new Unauthorized("Card is expired")

    if(!bcrypt.compareSync(paymentInfo.password, card.password)) throw new Unauthorized("Password is wrong")
    if(card.isBlocked) throw new Forbidden("Blocked card")

    const business = await businessRepository.findById(paymentInfo.businessId)
    if(!business) throw new NotFound("Business not registered")

    if(business.type !== card.type) throw new Unauthorized("Invalid transaction")

    const [ totalRecharges, totalPayments ] = await cardRepository.getTotalOfTransactions(paymentInfo.cardId)
    const balance = totalRecharges.value - totalPayments.value
    if(balance < paymentInfo.amount) throw new Unauthorized("Insufficient balance")

    await paymentRepository.insert({cardId:paymentInfo.cardId, businessId:paymentInfo.businessId, amount:paymentInfo.amount})
}

export async function makeOnlinePurchase(purchaseInfo: any){
    const { number, name, expirationDate, CVC, businessId, amount } = purchaseInfo

    const card = await cardRepository.findByCardDetails(number, name, expirationDate);
    if(!card) throw new NotFound("Card not registered")
    const cardIdForPurchase = card.isVirtual ? card.originalCardId : card.id

    if(!bcrypt.compareSync(CVC, card.securityCode)) throw new Unauthorized("CVC is wrong")

    const formatedExpirationDate = `${card.expirationDate.split("/")[0]}/01/${card.expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new Unauthorized("Card is expired")
    if(card.isBlocked) throw new Forbidden("Blocked card")

    const business = await businessRepository.findById(businessId)
    if(!business) throw new NotFound("Business not registered")

    if(business.type !== card.type) throw new Unauthorized("Invalid card type")


    const [ totalRecharges, totalPayments ] = await cardRepository.getTotalOfTransactions(cardIdForPurchase)
    const balance = totalRecharges.value - totalPayments.value
    if(balance < amount) throw new Unauthorized("Insufficient balance")

    await paymentRepository.insert({cardId:cardIdForPurchase, businessId, amount})
}