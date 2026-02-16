import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      category_name: true,
      icon: true,
      _count: {
        select: {
          medicines: {
          }
        }
      }
    },
  });
};

const createCategory = async (category_name: string, icon: string) => {
  return prisma.category.create({
    data: {
      category_name,
      icon
    },
  });
};

const updateCategory = async (
  id: string,
  icon?: string,
  category_name?: string
) => {
  const data: Partial<{ icon: string; category_name: string }> = {};

  if (icon) {
    data.icon = icon;
  }

  if (category_name) {
    data.category_name = category_name;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided to update");
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};


const deleteCategory = async (id: string) => {

  return await prisma.category.delete({
    where: { id },
  });
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
