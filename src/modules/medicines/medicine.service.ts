import { Medicine } from "../../generated/client";
import { MedicineWhereInput } from "../../generated/models"
import { prisma } from "../../lib/prisma"

interface AddMedicineDTO {
    title: string;
    description: string;
    manufacturer: string;
    convertPrice: number;
    convertStock: number;
    sellerId: string;
    categoryId: string;
}

const getAllMedicine = async ({
    search,
    category,
    minPrice,
    maxPrice,
    manufacturer,
    page,
    skip,
    limit
}: {
    search: string | undefined
    category: string | undefined
    minPrice: number
    maxPrice: number
    manufacturer: string | undefined
    page: number
    skip: number
    limit: number
}) => {

    const andCondition: MedicineWhereInput[] = []


    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    categoryRef: {
                        category_name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
            ]
        })
    }


    if (category) {
        andCondition.push({
            categoryRef: {
                category_name: {
                    equals: category,
                    mode: "insensitive"
                }
            }
        })
    }


    if (manufacturer) {
        andCondition.push({
            manufacturer: {
                contains: manufacturer,
                mode: "insensitive"
            }
        })
    }


    if (minPrice !== undefined || maxPrice !== undefined) {
        andCondition.push({
            price: {
                gte: minPrice,
                lte: maxPrice
            }
        })
    }

    const allMedicine = await prisma.medicine.findMany({
        where: {
            AND: andCondition
        },
        skip,
        take: limit,
        include: {
            categoryRef: true
        },
    })

    const total = await prisma.medicine.count({
        where: {
            AND: andCondition
        }
    })




    return {
        data: allMedicine, pagination: {
            total,
            page, limit, totalPage: Math.ceil(total / limit)
        }
    }
}

const getMedicine = async (id: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: { id },
        include: {
            categoryRef: {
                select: {
                    category_name: true
                }
            }
        }
    })

    if (!medicine) {
        throw new Error("Medicine not found")
    }

    return medicine
}


const addMedicine = async ({ title,
    description,
    manufacturer,
    convertPrice,
    convertStock,
    sellerId,
    categoryId, }: AddMedicineDTO) => {


    console.log(typeof convertPrice, typeof convertStock);

    return prisma.medicine.create({
        data: {
            title,
            description,
            manufacturer,
            price: convertPrice,
            stock: convertStock,
            sellerId,
            categoryId,
        },
        include: {
            categoryRef: { select: { category_name: true } },
        },
    })
}


const updateMedicine = async (
 
    id: string,   sellerId: string,
    payload: Omit<Medicine, "id">
): Promise<Medicine> => {
    console.log(payload);
    const medicine = await prisma.medicine.findFirst({
  where: { id, sellerId }
})
if (!medicine) throw new Error("Unauthorized")

    const result = await prisma.medicine.update({
        where: { id },
        data: payload,
    });

    return result;
};

const removeMedicine = async (id: string,sellerId:string): Promise<Medicine | null> => {

    

    
    const medicine = await prisma.medicine.findUnique({
        where: { id ,sellerId}, select: { id: true }
    });
    if (!medicine) { throw new Error("Medicine not found") }

    const result = await prisma.medicine.delete({
        where: { id }
    });
    return result;

}






export const medicineService = {
    getAllMedicine, getMedicine, addMedicine, updateMedicine, removeMedicine
}