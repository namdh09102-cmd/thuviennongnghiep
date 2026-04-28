import prisma from '../config/prisma';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
};
