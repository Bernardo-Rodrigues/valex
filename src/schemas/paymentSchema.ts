import joi from "joi"
const cardPasswordRegex = /^[0-9]{4}$/

const paymentSchema = joi.object({
    password: joi.string().pattern(cardPasswordRegex).required(),
    businessId: joi.number().required(),
    amount: joi.number().min(1).required()
})

export default paymentSchema;