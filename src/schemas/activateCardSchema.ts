import joi from "joi"

const cardPasswordRegex = /^[0-9]{4}$/
const CVCRegex = /^[0-9]{3}$/

const activateCardSchema = joi.object({
    CVC: joi.string().pattern(CVCRegex).required(),
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default activateCardSchema;