import { ProductModel, ProductDocument } from '../models/product.model';
import { CategoryModel } from '../models/category.model';

export const createProduct = async (data: Partial<ProductDocument>) => {
  if (data.category) {
    const exists = await CategoryModel.findById(data.category);
    if (!exists) throw new Error('Category not found');
  }
  return ProductModel.create(data);
};

export const getAllProducts = async () => {
  return ProductModel.find().populate('category');
};

export const getProductById = async (id: string) => {
  return ProductModel.findById(id).populate('category');
};

export const updateProduct = async (id: string, data: Partial<ProductDocument>) => {
  if (data.category) {
    const exists = await CategoryModel.findById(data.category);
    if (!exists) throw new Error('Category not found');
  }
  return ProductModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteProduct = async (id: string) => {
  return ProductModel.findByIdAndDelete(id);
};
