import { NextFunction, Request, Response } from "express"
import { statisticsService } from "./statistics.service"
import { sendResponse } from "../../middleware/sendRes"



const adminStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = await statisticsService.adminStatistics()


        if (!data) {
            return sendResponse(res, {
                success: false,
                message: "No data found",
                errors: "data fetching successful but nothing to show here"
            }, 404);
        }


        return sendResponse(res, {
            success: true,
            message: "data fetch successfully",
            data
        }, 200);


    } catch (error) {
        next(error)
    }

}


const SellerStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = await statisticsService.SellerStatistics()

        if (!data) {
            return sendResponse(res, {
                success: false,
                message: "No data found",
                errors: "data fetching successful but nothing to show here"
            }, 404);
        }

        return sendResponse(res, {
            success: true,
            message: "data fetch successfully",
            data
        }, 200);


    } catch (error) {
        next(error)
    }

}



export const statisticsController = {
    adminStatistics, SellerStatistics
}