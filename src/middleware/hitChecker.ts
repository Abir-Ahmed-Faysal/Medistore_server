import { NextFunction, Request, Response } from "express";

export const hitApi = (req: Request, res: Response, next: NextFunction) => {
    const apiUrl = req?.originalUrl;
    const method = req?.method;
    const queryParams = req?.query;


    console.log(apiUrl, method, queryParams);


    next()
}