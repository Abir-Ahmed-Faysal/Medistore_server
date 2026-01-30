import e, { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/client";

export function universalErrorHandler(err: unknown, __: Request, res: Response, _: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails: unknown = err;


    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Your provided data is invalid.";

    }


    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === "P2025") {
            statusCode = 400
            errorMessage = "An operation failed it depends on one or more records that were required but not found.";

        }


        if (err.code === "P2002") {
            statusCode = 400
            errorMessage = "Duplicate key or attribute.";

        }

        if (err.code === "P2003") {
            statusCode = 400
            errorMessage = "Foreign key constrain failed.";

        }
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Database connection failed due to Authentication failed.Please  check your credential.";
        }
        if (err.errorCode === "P1001") {
            statusCode = 503;
            errorMessage = "Database connection failed due to the database server is not running or is unreachable.";
        }
    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "An unknown error occurred while processing the request.";
    }




    res.status(statusCode).json({
        message: errorMessage,
        error: errorDetails
    });

}