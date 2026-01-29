import { NextFunction, Request, Response } from "express";

export const hitApi = (req: Request, res: Response, next: NextFunction) => {
    console.log("hit the api middleware \n ", "body is here: \n", req.body, 'url here:\n', req.url);
    next()
}