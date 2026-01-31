import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../middleware/sendRes";
import { registerService } from "./auth.services";

const getCurrentUser = (req: Request, res: Response) => {

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { id, email, name, role, banned } = req.user;
  return res.status(200).json({ id, email, name, role, banned });
};



const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, email, password,image,callbackURL ,role} = req.body;

    

    const newUser = await registerService.registerUser({
name, email, password,image,role
    });

    return sendResponse(res, {
      success: true,
      message: "Registered successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    }, 201);
  } catch (error: any) {

    if (error.message.includes("Email already exists")) {
      return sendResponse(res, {
        success: false,
        message: "Email already registered",
      }, 400);
    }
    next(error);
  }
}












export const authController = {
  getCurrentUser, registerUser
};
