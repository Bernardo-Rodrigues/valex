import joi from "joi"

const cardPasswordRegex = /^[0-9]{4}$/

const cardPasswordSchema = joi.object({
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default cardPasswordSchema;