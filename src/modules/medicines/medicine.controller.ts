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
            page, skip, limit
        } = PaginationHelperFunction(req.query)

        const allMedicine = await medicineService.getAllMedicine({
            search,
            category,
            minPrice,
            maxPrice,
            manufacturer,
            page, skip, limit
        })

        if (!allMedicine) {
            return sendResponse(res, { success: false, message: "no medicine found" }, 404)
        }
        return sendResponse(res, { success: true, message: "medicine data retrieve successfully", data: allMedicine }, 404)
    } catch (error) {
        next(error)
    }
}


const getMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        if (!id || typeof id !== 'string') {
            throw new Error("id not found")
        }
        const findMedicine = await medicineService.getMedicine(id)
        if (!findMedicine) {
            return sendResponse(res, { success: false, message: "medicine not found" }, 404)
        }
        return sendResponse(res, { success: true, message: "medicine data retrieve successfully", data: findMedicine }, 200)
    } catch (error) {
        next(error)
    }
}



const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, manufacturer, price, stock, sellerId, categoryId } = req.body;


        if (!title || !description || !manufacturer || !price || !stock || !sellerId || !categoryId) {
            return sendResponse(res, { success: false, message: "All fields are required" }, 400);
        }
        const convertStock = Number(stock)
        const convertPrice = Number(price)

        const newMedicine = await medicineService.addMedicine({
            title,
            description,
            manufacturer,
            convertPrice,
            convertStock,
            sellerId,
            categoryId,
        });

        return sendResponse(res, {
            success: true,
            message: "Medicine added successfully",
            data: newMedicine,
        }, 201);
    } catch (error) {
        next(error);
    }
};

const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        if (!id || typeof id !== "string" || !payload) {
            throw new Error("id updated data not found")
        }
        const result = await medicineService.updateMedicine(id, payload);

        sendResponse(res, {
            success: true,
            message: "Medicine updated successfully",
            data: result,
        }, 200);
    } catch (error) {
        next(error)
    }
};

const removeMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            throw new Error("id not found")
        }
        const result = await medicineService.removeMedicine(id);
        if (!result) {
            return sendResponse(res, { success: false, message: "medicine not found" }, 404)
        }
        sendResponse(res, {
            success: true,
            message: "Medicine removed successfully",
            data: result,
        }, 200);

    } catch (error) {
        next(error)
    }
}




export const medicineController = {
    getAllMedicines, getMedicine, addMedicine, updateMedicine,removeMedicine
}