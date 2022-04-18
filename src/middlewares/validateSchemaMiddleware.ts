import joi from "joi"
import { NextFunction, Request, Response } from "express"
import { stripHtml } from "string-strip-html"
import { UnprocessableEntity } from "../errors/index.js"

function sanitizeString(string: string){
    return stripHtml(string).result.trim();
}

export default function validateSchemaMiddleware(schema: joi.ObjectSchema){
    return (req: Request, res: Response, next: NextFunction) => {
        const { body } = req;

        Object.keys(body).forEach( key => {
            if(typeof(body[key]) === "string") body[key] = sanitizeString(body[key])
        });

        const validation = schema.validate(body, { abortEarly: false });
        if(validation.error) throw new UnprocessableEntity(validation.error.message);

        next();
    };
} 