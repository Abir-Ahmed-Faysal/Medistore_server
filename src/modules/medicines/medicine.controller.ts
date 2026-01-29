import { NextFunction,Request,Response } from "express"

const getAllMedicines=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {filterBy,category,page,}=req.query
        
    } catch (error) {
        
    }
}


export const medicineController= {
    getAllMedicines
}