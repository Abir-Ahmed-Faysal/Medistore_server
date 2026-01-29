import { Response } from "express";
import { ApiResponse } from "../types/apiResponse";


export const sendResponse = <T>(
  res: Response,
  payload: ApiResponse<T>,
  statusCode: number = 200
) => {
  res.status(statusCode).json(payload);
};
