import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as cardRepository from "../repositories/cardRepository.js"
import Unauthorized from "../errors/UnauthorizedError.js";
import Forbidden from "../errors/ForbiddenError.js";

export async function createOnlineCard(vinculatedCard: any){
    const card = await cardRepository.findById(vinculatedCard.vinculatedId);
    if(!card) throw new NotFound("Card not registered")
    const { id:originalCardId, employeeId, cardholderName, type, password } = card

    if(!password) throw new Forbidden("Card has not yet been activated")
    if(!bcrypt.compareSync(vinculatedCard.cardPassword, password)) throw new Unauthorized("Password is wrong")
    if(cardholderName !== vinculatedCard.name) throw new Unauthorized("Name is wrong")

    const securityCode = faker.finance.creditCardCVV()
    const hashedSecurityCode = bcrypt.hashSync(securityCode, 12);
    const expirationDate = dayjs().add(5, "year").format("MM/YY")
    const number = faker.finance.creditCardNumber('mastercard')

    const id = await cardRepository.insert({
        employeeId,
        number,
        cardholderName,
        securityCode: hashedSecurityCode,
        password,
        expirationDate,
        isVirtual: true,
        originalCardId,
        isBlocked: false,
        type

    })

    return {id, securityCode};
}

export async function deleteOnlineCard(cardInfo: any){
    const card = await cardRepository.findById(cardInfo.cardId);
    if(!card) throw new NotFound("Card not registered")

    if(!card.isVirtual) throw new Forbidden("Only virtual cards can be deleted")
    if(!bcrypt.compareSync(cardInfo.cardPassword, card.password)) throw new Unauthorized("Password is wrong")

    await cardRepository.remove(cardInfo.cardId);
}