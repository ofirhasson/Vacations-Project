import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { RouteNotFoundError } from "../3-models/client-errors";
import { logger } from "../2-utils/logger";
import { appConfig } from "../2-utils/app-config";

class ErrorsMiddleware {

    // Route not found:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new RouteNotFoundError(request.originalUrl);
        next(err);
    }
    
    // Catch all: 
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {
        // Log error to file:
        logger.logError(err);
        const status = err.status || StatusCode.InternalServerError;
        const message = (status === StatusCode.InternalServerError && appConfig.isProduction) ? "Some error, please try again later." : err.message;
        response.status(status).send(message);
    }
}
export const errorsMiddleware = new ErrorsMiddleware();
