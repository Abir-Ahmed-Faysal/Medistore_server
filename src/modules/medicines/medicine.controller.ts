import { NextFunction, Request, Response } from "express"
import { PaginationHelperFunction } from "../../helper/PaginationHelperFunction"
import { medicineService } from "./medicine.service"
import { sendResponse } from "../../middleware/sendRes"







    const getAllMedicines = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const filters = PaginationHelperFunction(req.query)

            const result = await medicineService.getAllMedicine(filters)

            return sendResponse(
                res,
                {
                    success: true,
                    message: "Medicine data retrieved successfully",
                    data: result,
                },
                200
            )
        } catch (error) {
            next(error)
        }
    }

    const bulkAddMedicineController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { medicines } = req.body;
    const { id: sellerId } = req.user!;

    if (!sellerId) {
      throw new Error("Seller not found");
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return sendResponse(
        res,
        { success: false, message: "Medicine array is required" },
        400
      );
    }

    const result = await medicineService.bulkAddMedicine(
      medicines,
      sellerId
    );

    return sendResponse(
      res,
      {
        success: true,
        message: "Bulk medicines added successfully",
        data: result
      },
      201
    );

  } catch (error) {
    next(error);
  }
};




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
            const { title, description, manufacturer, price, stock, categoryId, image } = req.body;
            const { id: sellerId } = req.user!;

            if (!sellerId || typeof sellerId !== "string") {
                throw new Error("seller id not found")
            }


            if (!title || !description || !manufacturer || !price || !stock || !sellerId || !categoryId || !image) {
                return sendResponse(res, { success: false, message: "All fields are required" }, 400);
            }
            const convertStock = Number(stock)
            const convertPrice = Number(price)


            const newMedicine = await medicineService.addMedicine({
                image,
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
            const { id: sellerId } = req?.user!
            const { id } = req.params;
            const payload = req.body;

            if (!sellerId || typeof sellerId !== "string") {
                throw new Error("seller not found")
            }

            if (!id || typeof id !== "string" || !payload) {
                throw new Error("id updated data not found")
            }
           

            if (payload.price) {
                payload.price = Number(payload.price);
            }
            if (payload.stock) {
                payload.stock = Number(payload.stock);
            }


            const result = await medicineService.updateMedicine(id, sellerId, payload);

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
            const { id: sellerId } = req?.user!
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                throw new Error("id not found")
            }
            if (!sellerId || typeof sellerId !== "string") {
                throw new Error("seller not found")
            }
            const result = await medicineService.removeMedicine(id, sellerId);
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
        getAllMedicines, getMedicine, addMedicine, updateMedicine, removeMedicine, bulkAddMedicineController
    }