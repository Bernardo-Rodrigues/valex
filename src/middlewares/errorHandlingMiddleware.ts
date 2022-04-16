import { NextFunction, Request, Response } from "express";
import Conflict from "../errors/ConflictError.js";
import NotFound from "../errors/NotFoundError.js";
import Unauthorized from "../errors/UnauthorizedError.js";
import UnprocessableEntity from "../errors/UnprocessableEntityError.js";
import BadRequest from "../errors/BadRequestError.js";
import Forbidden from "../errors/ForbiddenError.js";

export default async function errorHandlingMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
	if (error instanceof UnprocessableEntity || 
        error instanceof NotFound || 
        error instanceof Conflict || 
        error instanceof Forbidden || 
        error instanceof BadRequest || 
        error instanceof Unauthorized
    ) return res.status(error.status).send(error.message);

    return res.status(500).send(error.message);
} 