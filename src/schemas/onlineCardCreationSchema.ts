import joi from "joi"

const cardPasswordRegex = /^[0-9]{4}$/

const onlineCardCreationSchema = joi.object({
    vinculatedId: joi.number().required(),
    cardPassword: joi.string().pattern(cardPasswordRegex).required()
})

export default onlineCardCreationSchema;