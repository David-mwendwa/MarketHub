import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { Plus, Eye, Edit, ArrowLeft } from 'lucide-react';
import { useProduct } from '../../../../contexts/ProductContext';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/Tabs';
import { Badge } from '../../../../components/ui/Badge';
import { Separator } from '../../../../components/ui/separator';
import { ROUTES } from '../../../../constants/routes';

// Import the product detail components from shared
import ProductDetails from '../../shared/ProductDetails';
import ProductImages from '../../shared/ProductImages';
import ProductVariations from '../../shared/ProductVariations';
import ProductStats from '../../shared/ProductStats';
import ProductForm from '../../shared/ProductForm';

const SellerProductDetailsPage = () => {
  const { productId: id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get product data and methods from the context
  const { product, loading, error, fetchProduct, updateProduct } = useProduct();

  // Fetch product data when the component mounts or id changes
  useEffect(() => {
    const loadProduct = async () => {
      console.log('ProductDetails - Component mounted or id changed:', { id });
      if (id) {
        console.log('ProductDetails - Fetching product with ID:', id);
        try {
          const data = await fetchProduct(id);
          console.log('ProductDetails - Product fetch successful:', data);
        } catch (error) {
          console.error('ProductDetails - Error fetching product:', error);
        }
      } else {
        console.warn('ProductDetails - No product ID provided');
      }
    };

    loadProduct();
  }, [id, fetchProduct]);

  // Format product data for the form
  const formatProductForForm = (product) => {
    if (!product) return null;
    return {
      ...product,
      price: product.price / 100, // Convert from cents to dollars
      specialPrice: product.specialPrice ? product.specialPrice / 100 : null,
      stock: product.stock?.qty || 0,
      status: product.stock?.status || 'in_stock',
      images: product.gallery || [],
      variations: product.configurableOptions || [],
    };
  };

  const handleSaveProduct = async (updatedProduct) => {
    if (!id) return;

    try {
      setIsSaving(true);

      // Convert price back to cents before saving
      const productToUpdate = {
        ...updatedProduct,
        price: Math.round(updatedProduct.price * 100),
        specialPrice: updatedProduct.specialPrice
          ? Math.round(updatedProduct.specialPrice * 100)
          : null,
      };

      await updateProduct(id, productToUpdate);
      setIsEditing(false);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  console.log('ProductDetails - Current state:', {
    loading,
    error,
    product,
    isEditing,
    isSaving,
  });

  if (loading) {
    console.log('ProductDetails - Loading product...');
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
      </div>
    );
  }

  if (error) {
    console.error('ProductDetails - Error state:', error);
    return (
      <div className='p-4 text-red-500'>
        <p>Error loading product: {error.message || 'Unknown error'}</p>
        <div className='mt-2 text-sm text-gray-500'>
          <p>ID: {id}</p>
          <p>Error details: {JSON.stringify(error.response?.data || {})}</p>
        </div>
      </div>
    );
  }

  if (!id) {
    console.error('ProductDetails - No product ID provided in URL');
    return (
      <div className='p-4 text-red-500'>
        <p>Error: No product ID provided</p>
        <p className='text-sm text-gray-500 mt-2'>
          Please make sure you're accessing this page from a valid product link.
        </p>
      </div>
    );
  }

  if (!product) {
    console.warn('ProductDetails - Product not found for ID:', id);
    return (
      <div className='p-4'>
        <p>Product not found</p>
        <p className='text-sm text-gray-500'>ID: {id}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className='space-y-6'>
        <ProductForm
          product={formatProductForForm(product)}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
          isSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate(-1)}
            className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {product.name}
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Product ID: {product._id} | SKU: {product.sku}
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditing(true)}>
            <Edit className='h-4 w-4 mr-2' />
            Edit Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue='details' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='details'>Product Details</TabsTrigger>
          <TabsTrigger value='images'>Images</TabsTrigger>
          <TabsTrigger value='variations'>Variations</TabsTrigger>
          <TabsTrigger value='stats'>Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductDetails product={formatProductForForm(product)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='images' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImages
                images={[...(product.gallery || [])].filter(Boolean)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='variations' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Variations</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductVariations
                variations={product.configurableOptions || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='stats' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductStats
                views={product.viewCount || 0}
                likes={product.likes || 0}
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProductDetailsPage;
