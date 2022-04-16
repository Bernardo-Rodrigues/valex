import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as cardRepository from "../repositories/cardRepository.js"
import Forbidden from "../errors/BadRequestError.js";
import Unauthorized from "../errors/UnauthorizedError.js";
import generateCardInfo from "../utils/generateCardInfo.js";

export async function createOnlineCard(vinculatedCard: any){
    const card = await validateCardExistence(vinculatedCard.vinculatedId)
    const { id: originalCardId, employeeId, cardholderName, type, password } = card

    if(!password) throw new Forbidden("Card has not yet been activated")
    if(!bcrypt.compareSync(vinculatedCard.cardPassword, password)) throw new Unauthorized("Password is wrong")

    const { number, securityCode, expirationDate } = generateCardInfo()

    await cardRepository.insert({
        employeeId,
        number,
        cardholderName,
        securityCode,
        password,
        expirationDate,
        isVirtual: true,
        originalCardId,
        isBlocked: false,
        type

    })
}

export async function deleteOnlineCard(cardInfo: any){
    const card = await validateCardExistence(cardInfo.cardId)

    if(!card.isVirtual) throw new Forbidden("Only virtual cards can be deleted")
    if(!bcrypt.compareSync(cardInfo.cardPassword, card.password)) throw new Unauthorized("Password is wrong")

    await cardRepository.remove(cardInfo.cardId);
}

async function validateCardExistence(cardId: number){
    const card = await cardRepository.findById(cardId);
    if(!card) throw new NotFound("Card not registered")
    
    return card
}