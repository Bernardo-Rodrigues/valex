import joi from "joi";

const cardPasswordRegex = /^[0-9]{4}$/;
const cvcRegex = /^[0-9]{3}$/;

const activateCardSchema = joi.object({
    cvc: joi.string().pattern(cvcRegex).required(),
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default activateCardSchema;