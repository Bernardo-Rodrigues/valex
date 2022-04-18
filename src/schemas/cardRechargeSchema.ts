import joi from "joi"

const cardRechargeSchema = joi.object({
    amount: joi.number().min(1).required()
})

export default cardRechargeSchema;