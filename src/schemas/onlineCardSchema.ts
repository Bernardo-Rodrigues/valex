import joi from "joi";

const cardPasswordRegex = /^[0-9]{4}$/

const onlineCardSchema = joi.object({
    vinculatedId: joi.number().required(),
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default onlineCardSchema;