import { NextFunction } from "connect";
import { Request, Response } from "express";
import * as companyService from "../services/companyService.js"

export default async function validateApiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];
    
    const company = await companyService.validateKey(apiKey.toString());
    res.locals.company = company;

    next();
}