import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { Plus, Eye, Edit, ArrowLeft } from 'lucide-react';
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock product data - replace with API call using the id
  const mockProduct = {
    id: id || '1',
    name: 'Premium Wireless Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    stock: 45,
    sku: 'PHONE-001',
    status: 'active',
    isFeatured: true,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    ],
    variations: [
      {
        id: '1',
        name: 'Black',
        price: 299.99,
        stock: 20,
        sku: 'PHONE-001-BLK',
      },
      {
        id: '2',
        name: 'White',
        price: 319.99,
        stock: 15,
        sku: 'PHONE-001-WHT',
      },
      { id: '3', name: 'Blue', price: 309.99, stock: 10, sku: 'PHONE-001-BLU' },
    ],
    stats: {
      views: 1245,
      sales: 234,
      revenue: 70197.66,
      rating: 4.7,
    },
    seller: {
      id: 'seller-123',
      name: 'TechGadgets Inc.',
      email: 'contact@techgadgets.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2022-01-15',
      status: 'verified',
      rating: 4.8,
      totalProducts: 24,
      totalSales: 1245,
    },
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-11-20T14:45:00Z',
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      setIsSaving(true);
      console.log('Saving product:', updatedProduct);
      // TODO: Implement actual API call to save the product
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Update the local state with the saved product
      // In a real app, you might want to refetch the product data here
      Object.assign(mockProduct, updatedProduct);

      setIsEditing(false);
      // You might want to show a success toast here
    } catch (error) {
      console.error('Error saving product:', error);
      // You might want to show an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className='space-y-6'>
        <ProductForm
          product={mockProduct}
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
            onClick={() => navigate(ROUTES.DASHBOARD.SELLER_PRODUCTS)}
            className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Products
          </Button>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Product: {mockProduct.name}
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Product ID: {mockProduct.id} | SKU: {mockProduct.sku}
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
              <ProductDetails product={mockProduct} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='images' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImages images={mockProduct.images} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='variations' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Variations</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductVariations variations={mockProduct.variations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='stats' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Product Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductStats stats={mockProduct.stats} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProductDetailsPage;
