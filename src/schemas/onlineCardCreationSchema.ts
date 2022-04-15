import joi from "joi"

const cardPasswordRegex = /^[0-9]{4}$/

const onlineCardCreationSchema = joi.object({
    name: joi.string().required(),
    vinculatedId: joi.number().required(),
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default onlineCardCreationSchema;