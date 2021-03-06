import joi from "joi"

const numberdRegex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/
const cvcRegex = /^[0-9]{3}$/
const dateRegex = /^[0-9]{2}\/[0-9]{2}$/

const onlinePurchaseSchema = joi.object({
    number: joi.string().pattern(numberdRegex).required(),
    name: joi.string().required(),
    expirationDate: joi.string().pattern(dateRegex).required(),
    cvc: joi.string().pattern(cvcRegex).required(),
    businessId: joi.number().required(),
    amount: joi.number().min(1).required()
})

export default onlinePurchaseSchema;