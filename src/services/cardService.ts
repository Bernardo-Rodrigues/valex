import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import NotFound from "../errors/NotFoundError.js";
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import Conflict from "../errors/ConflictError.js";
import { formatEmployeeName } from "../utils/formatEmployeeName.js";

export async function createCard(newCard: any){
    const employee = await employeeRepository.findById(newCard.employeeId);
    if(!employee) throw new NotFound("Employee not found")

    const sameTypeCard = await cardRepository.findByTypeAndEmployeeId(newCard.cardType, newCard.employeeId)
    if(sameTypeCard) throw new Conflict("Employee already has a card of this type")

    const cardNumber = faker.finance.creditCardNumber('mastercard')
    const securityCode = faker.finance.creditCardCVV()
    const hashedSecurityCode= bcrypt.hashSync(securityCode, 12);
    const expirationDate = dayjs().add(5, "year").format("MM/YY")
    const cardholderName = formatEmployeeName(employee.fullName)

    await cardRepository.insert({
        employeeId: newCard.employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: hashedSecurityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type: newCard.cardType

    })
}