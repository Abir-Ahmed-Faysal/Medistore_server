import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../middleware/sendRes"
import { userService } from "./user.service"

const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUser()

        if (!users) {
            return sendResponse(res, { success: false, message: "no user found", })
        }

        return sendResponse(res, { success: true, message: "users data fetch successfully", data: users }, 200)

    } catch (error) {


        const errorM = error instanceof Error ? error.message : "something went wrong !"

        return sendResponse(res, { success: true, message: "users data fetch successfully", errors: errorM }, 200)

    }

}

const banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        if (!id || typeof id !== "string") {
            throw new Error("id not found")
        }
        const user = await userService.banUser(id);

        return sendResponse(res, {
            success: true,
            message: "User banned successfully",
            data: user
        }, 200);
    } catch (error) {
        next(error);
    }
};

const unBanUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        if (!id || typeof id !== "string") {
            throw new Error("id not found")
        }

        const user = await userService.unBanUser(id);

        return sendResponse(res, {
            success: true,
            message: "User unbanned successfully",
            data: user
        }, 200);
    } catch (error) {
        next(error);
    }
};



export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, image, phone, address } = req.body;
        const { id } = req.user as { id?: string };

        if (!id || typeof id !== "string") {
            return sendResponse(
                res,
                { success: false, message: "Forbidden" },
                403
            );
        }


        const payload = {
            name,
            image,
            phone,
            address,
        };


        const updatePayload = Object.fromEntries(
            Object.entries(payload).filter(
                ([_, value]) =>
                    value !== undefined &&
                    value !== null &&
                    value !== ""
            )
        );

        if (Object.keys(updatePayload).length === 0) {
            return sendResponse(
                res,
                { success: false, message: "Nothing to update" },
                400
            );
        }


        const data = await userService.updateUser(id, updatePayload);

        if (!data) {
            return sendResponse(
                res,
                { success: false, message: "Update failed" },
                400
            );
        }

        return sendResponse(
            res,
            { success: true, message: "Updated successfully", data },
            200
        );
    } catch (error) {
        next(error);
    }
};


export const userController = {
    getAllUser, banUser, unBanUser,updateUser
}