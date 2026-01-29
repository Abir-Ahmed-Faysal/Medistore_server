import { NextFunction, Request, Response } from "express"
import { PaginationHelperFunction } from "../../helper/PaginationHelperFunction"
import { medicineService } from "./medicine.service"
import { sendResponse } from "../../middleware/sendRes"

const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            search,
            category,
            minPrice,
            maxPrice,
            manufacturer,
            page, skip
        } = PaginationHelperFunction(req.query)

        const allMedicine = await medicineService.getAllMedicine({
            search,
            category,
            minPrice,
            maxPrice,
            manufacturer,
            page, skip
        })

        if (!allMedicine) {
            return sendResponse(res, { success: false, message: "no medicine found" }, 404)
        }
        return sendResponse(res, { success: true, message: "medicine data retrieve successfully" }, 404)
    } catch (error) {
        next(error)
    }
}


export const medicineController = {
    getAllMedicines
}