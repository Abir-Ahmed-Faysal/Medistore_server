import { NextFunction, Request, Response } from "express"

export const hitApi = async (req: Request, res: Response, next: NextFunction) => {
    console.log("hit the api", "here is body", req, "req body is here", req.body);
    next()
}