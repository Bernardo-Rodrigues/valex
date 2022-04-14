import joi from "joi"

const cardSchema = joi.object({
    employeeId: joi.number().required(),
    cardType: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
})

export default cardSchema;