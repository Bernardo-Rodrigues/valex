import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export default function generateCardInfo(){
    const number = faker.finance.creditCardNumber('mastercard')
    const securityCode = faker.finance.creditCardCVV()
    const hashedSecurityCode = bcrypt.hashSync(securityCode, 12);
    const expirationDate = dayjs().add(5, "year").format("MM/YY")

    return {number, securityCode:hashedSecurityCode, expirationDate}
}