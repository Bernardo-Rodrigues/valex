import { NextFunction, Request, Response } from "express";
import UnprocessableEntity from "../errors/UnprocessableEntityError.js";

export default async function errorHandlingMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
	if (error instanceof UnprocessableEntity) return res.status(error.status).send(error.message);

    return res.status(500).send(error.message);
} 