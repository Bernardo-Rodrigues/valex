import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as cardRepository from "../repositories/cardRepository.js"
import Unauthorized from "../errors/UnauthorizedError.js";

export async function createOnlineCard(vinculatedCard: any){
    const card = await cardRepository.findById(vinculatedCard.vinculatedId);
    if(!card) throw new NotFound("Card not registered")
    const { id:originalCardId, employeeId, cardholderName, type, password } = card

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
        expirationDate,
        isVirtual: true,
        originalCardId,
        isBlocked: false,
        type

    })

    return {id, securityCode};
}