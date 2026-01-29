import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      category_name: true,
    },
  });
};

const createCategory = async (category_name: string) => {
  return prisma.category.create({
    data: {
      category_name,
    },
  });
};

const updateCategory = async (id: string, category_name: string) => {
  return prisma.category.update({
    where: { id },
    data: { category_name },
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
