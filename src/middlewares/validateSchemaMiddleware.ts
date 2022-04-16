import { NextFunction, Request, Response } from "express"
import { stripHtml } from "string-strip-html"
import UnprocessableEntity from "../errors/UnprocessableEntityError.js"
import activateCardSchema from "../schemas/activateCardSchema.js"
import cardSchema from "../schemas/cardSchema.js"
import onlinePurchaseSchema from "../schemas/onlinePurchaseSchema.js"
import passwordSchema from "../schemas/passwordSchema.js"
import purchaseSchema from "../schemas/purchaseSchema.js"
import rechargeSchema from "../schemas/rechargeSchema.js"

function sanitizeString(string: string){
    return stripHtml(string).result.trim()
}

const schemas = {
    "/cards": cardSchema,
    "/cards/activate": activateCardSchema,
    "/cards/recharge": rechargeSchema,
    "/cards/block": passwordSchema,
    "/cards/unlock": passwordSchema,
    "/online-cards": passwordSchema,
    "/purchases/cards": purchaseSchema,
    "/purchases/online-card": onlinePurchaseSchema
}

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction){
    const { body } = req
    
    const route = formatPathName(req.path)
    const schema = schemas[route]

    Object.keys(body).forEach( key => {
        if(typeof(body[key]) === "string") body[key] = sanitizeString(body[key])
    })

    const validation = schema.validate(body, { abortEarly: false })
    if(validation.error) throw new UnprocessableEntity(validation.error.message);

    next()
} 

function formatPathName(path: string){
    const params = path.split("/")

    return (params[1] === "purchases")
    ? "/" + params[1] + "/" + params[2]
    : (params.length === 2 || params.length === 3)
    ? "/" + params[1]
    : "/" + params[1] + "/" + params[3]
}