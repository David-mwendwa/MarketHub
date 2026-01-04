import { createContext, useContext, useReducer, useEffect , useCallback} from 'react';
import { productService } from '@/services/product';

const ProductActionTypes = {
  FETCH_PRODUCTS_START: 'FETCH_PRODUCTS_START',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAIL: 'FETCH_PRODUCTS_FAIL',
  FETCH_PRODUCT_START: 'FETCH_PRODUCT_START',
  FETCH_PRODUCT_SUCCESS: 'FETCH_PRODUCT_SUCCESS',
  FETCH_PRODUCT_FAIL: 'FETCH_PRODUCT_FAIL',
  CREATE_PRODUCT_START: 'CREATE_PRODUCT_START',
  CREATE_PRODUCT_SUCCESS: 'CREATE_PRODUCT_SUCCESS',
  CREATE_PRODUCT_FAIL: 'CREATE_PRODUCT_FAIL',
  UPDATE_PRODUCT_START: 'UPDATE_PRODUCT_START',
  UPDATE_PRODUCT_SUCCESS: 'UPDATE_PRODUCT_SUCCESS',
  UPDATE_PRODUCT_FAIL: 'UPDATE_PRODUCT_FAIL',
  DELETE_PRODUCT_START: 'DELETE_PRODUCT_START',
  DELETE_PRODUCT_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
  DELETE_PRODUCT_FAIL: 'DELETE_PRODUCT_FAIL',
  RESET_PRODUCT: 'RESET_PRODUCT',
};

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case ProductActionTypes.FETCH_PRODUCTS_START:
    case ProductActionTypes.FETCH_PRODUCT_START:
    case ProductActionTypes.CREATE_PRODUCT_START:
    case ProductActionTypes.UPDATE_PRODUCT_START:
    case ProductActionTypes.DELETE_PRODUCT_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case ProductActionTypes.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
      };

    case ProductActionTypes.FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
      };

    case ProductActionTypes.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        products: [action.payload, ...state.products],
      };

    case ProductActionTypes.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        product: action.payload,
      };

    case ProductActionTypes.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
        product: null,
      };

    case ProductActionTypes.FETCH_PRODUCTS_FAIL:
    case ProductActionTypes.FETCH_PRODUCT_FAIL:
    case ProductActionTypes.CREATE_PRODUCT_FAIL:
    case ProductActionTypes.UPDATE_PRODUCT_FAIL:
    case ProductActionTypes.DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ProductActionTypes.RESET_PRODUCT:
      return {
        ...state,
        product: null,
        loading: false,
        error: null,
        success: false,
      };

    default:
      return state;
  }
};

const ProductContext = createContext(initialState);

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = useCallback(async (filters = {}, signal) => {
    try {
      dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_START });

			const response = await productService.getProducts(filters, { signal });
			console.log({response})
			const products = response.products || response.data?.products || [];

      dispatch({
        type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS,
        payload: products,
      });
    } catch (error) {
      if (error.name === 'AbortError') return;

      dispatch({
        type: ProductActionTypes.FETCH_PRODUCTS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error;
    }
	}, []);
	
  const fetchProduct = useCallback(async (id) => {
    try {
      dispatch({ type: ProductActionTypes.FETCH_PRODUCT_START });
      const response = await productService.getProduct(id);
      dispatch({
        type: ProductActionTypes.FETCH_PRODUCT_SUCCESS,
        payload: response.data || response,
      });
      return response.data || response;
    } catch (error) {
      if (error.name === 'AbortError') return;

      dispatch({
        type: ProductActionTypes.FETCH_PRODUCT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error;
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      dispatch({ type: ProductActionTypes.CREATE_PRODUCT_START });
      const response = await productService.createProduct(productData);
      dispatch({
        type: ProductActionTypes.CREATE_PRODUCT_SUCCESS,
        payload: response.data || response,
      });
      return response.data || response;
    } catch (error) {
      if (error.name === 'AbortError') return;

      dispatch({
        type: ProductActionTypes.CREATE_PRODUCT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      dispatch({ type: ProductActionTypes.UPDATE_PRODUCT_START });
      const response = await productService.updateProduct(id, productData);
      dispatch({
        type: ProductActionTypes.UPDATE_PRODUCT_SUCCESS,
        payload: response.data || response,
      });
      return response.data || response;
    } catch (error) {
      if (error.name === 'AbortError') return;

      dispatch({
        type: ProductActionTypes.UPDATE_PRODUCT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      dispatch({ type: ProductActionTypes.DELETE_PRODUCT_START });
      await productService.deleteProduct(id);
      dispatch({
        type: ProductActionTypes.DELETE_PRODUCT_SUCCESS,
        payload: id,
      });
    } catch (error) {
      if (error.name === 'AbortError') return;

      dispatch({
        type: ProductActionTypes.DELETE_PRODUCT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error;
    }
  }, []);

 const resetProduct = useCallback(() => {
   dispatch({ type: ProductActionTypes.RESET_PRODUCT });
 }, []);

  return (
    <ProductContext.Provider
      value={{
        ...state,
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        resetProduct,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
