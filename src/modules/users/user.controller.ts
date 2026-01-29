import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../middleware/sendRes"
import { userServices } from "./user.service"

const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userServices.getAllUser()

        if (!users) {
            return sendResponse(res, { success: false, message: "no user found", })
        }

        return sendResponse(res, { success: true, message: "users data fetch successfully", data: users }, 200)

    } catch (error) {


        const errorM = error instanceof Error ? error.message : "something went wrong !"

        return sendResponse(res, { success: true, message: "users data fetch successfully", errors: errorM }, 200)

    }

}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params


        if (!id || id && typeof id !== "string") {
            throw new Error("id not found ")
        }


        const user = await userServices.getUser(id)

        if (!user) {
            return sendResponse(res, {
                success: false, message: "user not found"
            }, 404)
        }


        return sendResponse(res, {
            success: true, message: "user data fetch successfully", data: user
        }, 200)

    } catch (error) {
        next(error)
    }




}


export const userController = {
    getAllUser, getUser
}