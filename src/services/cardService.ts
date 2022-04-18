import dayjs from "dayjs";
import bcrypt from "bcrypt";
import repositories from "../repositories/index.js";
import generateCardInfo from "../utils/generateCardInfo.js";
import { NotFound, Conflict, BadRequest, Forbidden, Unauthorized } from "../errors/index.js"
import { TransactionTypes, PaymentWithBusinessName } from "../types/index.js";
import { NewCard, ActivateCard, BlockOrUnlockCard, CardMetrics, Recharge, Card } from "../interfaces/index.js";

export default class CardService{
    async createCard(newCard: NewCard){
        await validateCardType(newCard.cardType, newCard.employeeId)
        const employeeName = await validateEmployee(newCard.employeeId)
        const cardInfo = generateCardInfo("card", employeeName)
    
        await repositories.card.insert({
            ...cardInfo,
            employeeId: newCard.employeeId,
            isVirtual: false,
            isBlocked: false,
            type: newCard.cardType
        })
    }

    async activateCard(cardInfo: ActivateCard){
        const card = await validateNonVirtualCard(cardInfo.cardId, "Only non-virtual cards must be activated")
        validateCardActivation(card, cardInfo)
    
        await repositories.card.update(cardInfo.cardId, {...card, password: bcrypt.hashSync(cardInfo.cardPassword, 12)});
    }
    
    async getMetrics(cardId: number){
        const card = await validateCardExistence(cardId)
        const originalId = card.isVirtual ? card.originalCardId : cardId
        const metrics = generateMetrics(originalId)
        
        return metrics
    }
    
    async rechargeCard(cardId: number, amount: number){
        await validateNonVirtualCard(cardId, "Virtual cards should not be recharged")
        await repositories.recharge.insert({cardId, amount});
    }
    
    async unlockCard(cardInfo: BlockOrUnlockCard){
        await blockOrUnlockCard("unlock", cardInfo);
    }
    
    async blockCard(cardInfo: BlockOrUnlockCard){
        await blockOrUnlockCard("block", cardInfo);
    }
}

async function validateCardType(type: TransactionTypes, employeeId: number) {
    const sameTypeCard = await repositories.card.findByTypeAndEmployeeId(type, employeeId)
    if(sameTypeCard) throw new Conflict("Employee already has a card of this type")
}

async function validateEmployee(id: number){
    const employee = await repositories.employee.findById(id);
    if(!employee) throw new NotFound("Employee not found")
    
    return employee.fullName
}

async function validateNonVirtualCard(cardId: number, message: string){
    const card = await validateCardExistence(cardId)
    
    await validateCardExpired(card.expirationDate)
    
    if(card.isVirtual) throw new Forbidden(message)

    return card
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


async function getBalance(cardId: number){
    const [ totalRecharges, totalPayments ] = await repositories.card.getTotalOfTransactions(cardId)
    return totalRecharges.value - totalPayments.value
}

async function blockOrUnlockCard(option: string, cardInfo: BlockOrUnlockCard){
    const card = await validateCardExistence(cardInfo.cardId)

    if(!bcrypt.compareSync(cardInfo.cardPassword, card.password)) throw new Unauthorized("Password is wrong")
    
    await validateCardExpired(card.expirationDate)
    
    switch(option){
        case "block": 
            if(card.isBlocked) throw new BadRequest("Card already blocked")
            await repositories.card.update(cardInfo.cardId, {...card, isBlocked: true}); 
            break;
        case "unlock":
            if(!card.isBlocked) throw new BadRequest("Card already unlocked")
            await repositories.card.update(cardInfo.cardId, {...card, isBlocked: false});
            break;
        default: break;
    }
    
}

async function generateMetrics (cardId: number){
    const recharges = await repositories.recharge.findByCardId(cardId)
    const transactions = await repositories.payment.findByCardId(cardId)
    const balance = await getBalance(cardId)

    return formatMetrics({balance, transactions, recharges})
}

function formatMetrics(metrics: CardMetrics){
    const transactions = formatDates(metrics.transactions)
    const recharges = formatDates(metrics.recharges)
    
    return {
        balance: metrics.balance,
        transactions,
        recharges
    }
}

function formatDates (objects: PaymentWithBusinessName[] | Recharge[]){
    return objects.map( (object: PaymentWithBusinessName) => {
        return{
            ...object,
            timestamp: dayjs(object.timestamp).format("DD/MM/YYYY"),
        }
    })
}

function validateCardActivation(card: Card, cardInfo: ActivateCard){
    if(card.password) throw new BadRequest("Card has already been activated")
    
    if(!bcrypt.compareSync(cardInfo.cvc, card.securityCode)) throw new Unauthorized("CVC is wrong")
}