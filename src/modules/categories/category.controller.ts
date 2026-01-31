import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

// GET all categories
const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCategories = await categoryService.getAllCategories();
        if(!allCategories){
            res.status(404).json({ success:false,message: "no category found" });
        }
        res.status(200).json({ success: true,message: "category data retrieve successfully", data: allCategories });
    } catch (error: any) {
        next(error)
    }
};


const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category_name } = req.body;
        if (!category_name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const newCategory = await categoryService.createCategory(category_name);
        res.status(201).json({ success: true, message: "category create successfully", data: newCategory });
    } catch (error: any) {
        next(error)
    }
};


const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }

        const updatedCategory = await categoryService.updateCategory(id as string, category_name);
        res.status(200).json({ success: true,message:"category data update successfully", data: updatedCategory });
    } catch (error: any) {
        next(error)
    }
};


const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id as string);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
        next(error)
    }
};

export const categoryController = {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
