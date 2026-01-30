import { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response, _: NextFunction) {
    res.status(404).json({
        message: "The requested resource was not found.",
        path: req.originalUrl,
        date: new Date().toISOString()
    });
}   