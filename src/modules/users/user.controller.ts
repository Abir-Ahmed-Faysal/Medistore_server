import { Request, Response } from "express"
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


export const userController = {
    getAllUser,
}