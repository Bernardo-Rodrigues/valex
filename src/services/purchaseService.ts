import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { NotFound, Forbidden, BadRequest, Unauthorized } from "../errors/index.js"
import repositories from "../repositories/index.js";
import { POSPurchase, OnlinePurchase, Card } from "../interfaces/index.js"

export default class PurchaseService {
    async makePOSPurchase(purchaseInfo: POSPurchase){
        const { cardId, businessId, amount, password } = purchaseInfo

        const card = await validateNonVirtualCard(cardId, "Virtual cards can not buy in POS")

        await validatePurchase(password, card, purchaseInfo)

        await repositories.payment.insert({cardId, businessId, amount})
    }

    async makeOnlinePurchase(purchaseInfo: OnlinePurchase){
        const { number, name, expirationDate, cvc, businessId, amount } = purchaseInfo

        const card = await validateCardForOnlinePurchase(number, name, expirationDate)

        await validatePurchase(cvc, card, purchaseInfo)

        await repositories.payment.insert({cardId:card.id, businessId, amount})
    }
}

async function validateBusiness(id: number, card: Card){
    const business = await repositories.business.findById(id);
    if(!business) throw new NotFound("Business not found")
    if(business.type !== card.type) throw new Forbidden("Invalid card type")
}

async function validateCardForOnlinePurchase(number: string, name: string, expirationDate: string) {
    const card = await repositories.card.findByCardDetails(number, name, expirationDate);
    if(!card) throw new NotFound("Card not registered")

    return {
        ...card,
        id: card.isVirtual ? card.originalCardId : card.id
    }
}

async function validateCardExistence(cardId: number){
    const card = await repositories.card.findById(cardId);
    if(!card) throw new NotFound("Card not registered")
    
    return card
}

async function validateCardExpired(expirationDate: string){
    const formatedExpirationDate = `${expirationDate.split("/")[0]}/01/${expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw new BadRequest("Card is expired")
}

async function validateCardBalance(amount: number, cardId: number) {
    const [ totalRecharges, totalPayments ] = await repositories.card.getTotalOfTransactions(cardId)
    const balance = totalRecharges.value - totalPayments.value
    if(balance < amount) throw new BadRequest("Insufficient balance")
}

async function validatePurchase(auth: string, card: Card, purchaseInfo: POSPurchase | OnlinePurchase){
    switch (auth.length){
        case 4: if(!bcrypt.compareSync(auth, card.password)) throw new Unauthorized("Password is wrong"); break;
        case 3: if(!bcrypt.compareSync(auth, card.securityCode)) throw new Unauthorized("CVC is wrong"); break;
        default: throw new Error();
    }

    await validateCardExpired(card.expirationDate)

    if(card.isBlocked) throw new Forbidden("Blocked card")

    await validateBusiness(purchaseInfo.businessId, card)

    await validateCardBalance(purchaseInfo.amount, card.id)
}

async function validateNonVirtualCard(cardId: number, message: string){
    const card = await validateCardExistence(cardId)
    
    await validateCardExpired(card.expirationDate)
    
    if(card.isVirtual) throw new Forbidden(message)

    return card
}