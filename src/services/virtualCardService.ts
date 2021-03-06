import bcrypt from "bcrypt";
import { NotFound, Forbidden, Unauthorized } from "../errors/index.js"
import { VinculatedCard, DeleteCard } from "../interfaces/index.js";
import repositories from "../repositories/index.js";
import generateCardInfo from "../utils/generateCardInfo.js";

export default class VirtualCardService {
    async createVirtualCard(vinculatedCard: VinculatedCard){
        const card = await validateCardExistence(vinculatedCard.vinculatedId)
        const { id: originalCardId, employeeId, cardholderName, type, password, isBlocked } = card
        const originalCardInfo = { originalCardId, employeeId, cardholderName, type, password, isBlocked }

        if(!password) throw new Forbidden("Card has not yet been activated")
        if(!bcrypt.compareSync(vinculatedCard.cardPassword, password)) throw new Unauthorized("Password is wrong")

        const virtualCardInfo = generateCardInfo("virtual-card", cardholderName)

        await repositories.card.insert({
            ...originalCardInfo,
            ...virtualCardInfo,
            isVirtual: true
        })
    }

    async deleteVirtualCard(cardInfo: DeleteCard){
        const card = await validateCardExistence(cardInfo.cardId)

        if(!card.isVirtual) throw new Forbidden("Only virtual cards can be deleted")
        if(!bcrypt.compareSync(cardInfo.cardPassword, card.password)) throw new Unauthorized("Password is wrong")

        await repositories.card.remove(cardInfo.cardId);
    }
}

async function validateCardExistence(cardId: number){
    const card = await repositories.card.findById(cardId);
    if(!card) throw new NotFound("Card not registered")
    
    return card
}