import { NextFunction, Request, Response } from "express"
import { stripHtml } from "string-strip-html"
import UnprocessableEntity from "../errors/UnprocessableEntityError.js"
import activateCardSchema from "../schemas/activateCardSchema.js"
import cardSchema from "../schemas/cardSchema.js"
import rechargeSchema from "../schemas/rechargeSchema.js"

function sanitizeString(string: string){
    return stripHtml(string).result.trim()
}

const schemas = {
    "/cards": cardSchema,
    "/cards/activate": activateCardSchema,
    "/cards/recharge": rechargeSchema
}

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction){
    const { body } = req
    const route = req.path.split("/").length === 2 
    ? "/"+req.path.split("/")[1]
    : "/"+req.path.split("/")[1]+"/"+req.path.split("/")[3]
    const schema = schemas[route]

    Object.keys(body).forEach( key => {
        if(typeof(body[key]) === "string") body[key] = sanitizeString(body[key])
    })

    const validation = schema.validate(body, { abortEarly: false })
    if(validation.error) throw new UnprocessableEntity(validation.error.message);

    next()
} 