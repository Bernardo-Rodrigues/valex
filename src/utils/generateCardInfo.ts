import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

const mastercardNumbers = [ "51", "52", "53", "54", "55"]

export default function generateCardInfo(type: string, employeeName: string = ""){
    const cardholderName = type === "card" ? formatEmployeeName(employeeName): employeeName
    const securityCode = faker.finance.creditCardCVV()
    const hashedSecurityCode = bcrypt.hashSync(securityCode, 12);
    const expirationDate = dayjs().add(5, "year").format("MM/YY")
    let number: string
    do{
        number = faker.finance.creditCardNumber('mastercard')
    }while(!mastercardNumbers.includes(number.slice(0,2)))

    return {number, securityCode:hashedSecurityCode, expirationDate, cardholderName}
}

function formatEmployeeName(employee: string) {
    const names = employee.split(" ");

    const cardholderName = names.map( (name, i) => {
        if(i === 0 || i === names.length - 1) return name.toUpperCase()
        if(name.length > 2) return name[0].toUpperCase()
    }).join(" ").split("  ").join(" ")

    return cardholderName;
}