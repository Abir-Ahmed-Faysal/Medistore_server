// import { Request, Response, NextFunction } from "express";
// import { sendResponse } from "./sendRes";
// import { ApiResponse } from "../types/apiResponse";

// /**
//  * Functional error creator
//  */
// export const createError = (
//   message: string,
//   statusCode: number = 500,
//   errors?: any
// ) => ({ message, statusCode, errors });


// export const errorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.error("Error caught in middleware:", err);

  
//   if (err.message && err.statusCode) {
//     const payload: ApiResponse<null> = {
//       success: false,
//       data: null,
//       error: err.errors ?? err.message,
//     };
//     return sendResponse(res, payload, err.statusCode);
//   }

//   // 2️⃣ Prisma known errors
//   if (err.code && err.meta) {
//     // PrismaClientKnownRequestError or PrismaClientValidationError
//     const payload: ApiResponse<null> = {
//       success: false,
//       data: null,
//       error: {
//         message: err.message,
//         code: err.code,
//         meta: err.meta,
//       },
//     };
//     return sendResponse(res, payload, 400);
//   }

//   // 3️⃣ Fallback for unknown errors
//   const payload: ApiResponse<null> = {
//     success: false,
//     data: null,
//     error: err.message || "Internal server error",
//   };
//   return sendResponse(res, payload, 500);
// };
