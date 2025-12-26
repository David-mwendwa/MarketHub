import { productsAPI } from '../lib/api';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await productsAPI.getAll(params);
      return response;
    } catch (error) {
      console.error('Error in productService.getProducts:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      return await productsAPI.getById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      return await productsAPI.create(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      return await productsAPI.update(id, productData);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      return await productsAPI.delete(id);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};
