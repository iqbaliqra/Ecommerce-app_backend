import { CategoryModel, CategoryDocument } from '../models/category.model';
import { ProductModel } from '../models/product.model';

export const createCategory = async (data: { name: string, description?: string }) => {
  return CategoryModel.create(data);
};

export const getCategories = async () => {
  return CategoryModel.find();
};

export const updateCategory = async (id: string, data: Partial<CategoryDocument>) => {
  return CategoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteCategory = async (id: string) => {
  
  await ProductModel.updateMany({ category: id }, { $unset: { category: "" } });
  return CategoryModel.findByIdAndDelete(id);
};
