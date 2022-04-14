import { NextFunction, Request, Response } from "express"
import { stripHtml } from "string-strip-html"
import UnprocessableEntity from "../errors/UnprocessableEntityError.js"
import cardSchema from "../schemas/cardSchema.js"

function sanitizeString(string: string){
    return stripHtml(string).result.trim()
}

const schemas = {
    "/cards": cardSchema
}

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction){
    const { body } = req
    const schema = schemas["/"+req.path.split("/")[1]]

    Object.keys(body).forEach( key => {
        if(typeof(body[key]) === "string") body[key] = sanitizeString(body[key])
    })

    const validation = schema.validate(body, { abortEarly: false })
    if(validation.error) throw new UnprocessableEntity(validation.error.message);

    next()
} 