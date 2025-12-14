import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { Badge } from '@components/ui/Badge';
import { Separator } from '@components/ui/Separator';
import { ROUTES } from '@/constants/routes';
import ProductDetails from '@pages/dashboard/shared/ProductDetails';
import ProductImages from '@pages/dashboard/shared/ProductImages';
import ProductVariations from '@pages/dashboard/shared/ProductVariations';
import ProductStats from '@pages/dashboard/shared/ProductStats';
import SellerInfo from '@pages/dashboard/admin/components/SellerInfo';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate(ROUTES.DASHBOARD.ADMIN_PRODUCTS)}
            className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Products
          </Button>
          <h1 className='text-2xl font-bold tracking-tight'>
            Product: {mockProduct.name}
          </h1>
          <p className='text-muted-foreground'>
            Product ID: {mockProduct.id} | SKU: {mockProduct.sku}
          </p>
        </div>
        <div className='flex space-x-2'>
          {isAdmin ? (
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                navigate(`/dashboard/seller/products/${mockProduct.id}`)
              }>
              View as Seller
            </Button>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                navigate(`/dashboard/seller/products/${mockProduct.id}`)
              }>
              Edit Product
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue='details' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='details'>Product Details</TabsTrigger>
          <TabsTrigger value='images'>Images</TabsTrigger>
          <TabsTrigger value='variations'>Variations</TabsTrigger>
          <TabsTrigger value='stats'>Statistics</TabsTrigger>
          <TabsTrigger value='seller'>Seller Info</TabsTrigger>
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
              <div className='flex items-center justify-between'>
                <CardTitle>Product Variations</CardTitle>
                <Button variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' /> Add Variation
                </Button>
              </div>
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

        <TabsContent value='seller' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <SellerInfo seller={mockProduct.seller} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailsPage;

// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '../../../components/ui/Button';
// import { ArrowLeft } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '../../../components/ui/Card';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '../../../components/ui/Tabs';
// import { Badge } from '../../../components/ui/Badge';
// import { Separator } from '../../../components/ui/separator';
// import { ROUTES } from '../../../constants/routes';

// // Import the product detail components
// import ProductDetails from '../components/products/ProductDetails';
// import ProductImages from '../components/products/ProductImages';
// import ProductVariations from '../components/products/ProductVariations';
// import ProductStats from '../components/products/ProductStats';
// import SellerInfo from './components/SellerInfo';

// // Mock product data - replace with API call
// const mockProduct = {
//   id: '1',
//   name: 'Premium Wireless Headphones',
//   description:
//     'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
//   price: 299.99,
//   stock: 45,
//   sku: 'PHONE-001',
//   status: 'active',
//   isFeatured: true,
//   category: 'Electronics',
//   images: [
//     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
//     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
//     'https://images.unsplash.com/photo-1572635196234-14e3b9221366?w=500&auto=format&fit=crop&q=60',
//   ],
//   variations: [
//     {
//       id: 'var1',
//       name: 'Black',
//       price: 299.99,
//       stock: 25,
//       sku: 'PHONE-001-BLK',
//     },
//     {
//       id: 'var2',
//       name: 'White',
//       price: 309.99,
//       stock: 20,
//       sku: 'PHONE-001-WHT',
//     },
//   ],
//   seller: {
//     id: 'seller1',
//     name: 'AudioTech Inc.',
//     email: 'contact@audiotech.com',
//     rating: 4.5,
//     totalProducts: 24,
//     joinedDate: '2023-01-15T00:00:00.000Z',
//     status: 'active',
//   },
//   stats: {
//     views: 1245,
//     sales: 156,
//     revenue: 46799.44,
//     rating: 4.7,
//   },
//   metadata: {
//     brand: 'AudioTech',
//     model: 'ATH-WS990BT',
//     color: 'Black',
//     weight: '250g',
//     dimensions: '18.5 x 17.5 x 8.5 cm',
//     wireless: true,
//     batteryLife: '30 hours',
//     noiseCancellation: true,
//   },
//   createdAt: '2023-05-10T14:30:00.000Z',
//   updatedAt: '2023-10-15T09:45:00.000Z',
// };

// const AdminProductDetails = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();

//   // In a real app, you would fetch the product data here
//   // const { data: product, isLoading, error } = useGetProductById(productId);
//   const product = mockProduct; // Using mock data for now

//   const handleBack = () => {
//     navigate(ROUTES.DASHBOARD.ADMIN_PRODUCTS);
//   };

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <Button variant='ghost' onClick={handleBack} className='mb-4'>
//           <ArrowLeft className='mr-2 h-4 w-4' />
//           Back to Products
//         </Button>

//         <div className='flex space-x-2'>
//           <Button variant='outline'>Edit Product</Button>
//           <Button>Save Changes</Button>
//         </div>
//       </div>

//       <div className='flex items-center justify-between'>
//         <div>
//           <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
//             {product.name}
//           </h1>
//           <div className='flex items-center space-x-2 mt-1'>
//             <Badge
//               variant={product.status === 'active' ? 'default' : 'secondary'}>
//               {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//             </Badge>
//             {product.isFeatured && <Badge variant='secondary'>Featured</Badge>}
//             <span className='text-sm text-gray-600 dark:text-gray-300'>
//               ID: {productId}
//             </span>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue='details' className='space-y-4'>
//         <TabsList>
//           <TabsTrigger value='details'>Details</TabsTrigger>
//           <TabsTrigger value='images'>Images</TabsTrigger>
//           <TabsTrigger value='variations'>Variations</TabsTrigger>
//           <TabsTrigger value='stats'>Statistics</TabsTrigger>
//         </TabsList>

//         <TabsContent value='details' className='space-y-4'>
//           <div className='grid gap-4 md:grid-cols-3'>
//             <div className='md:col-span-2 space-y-4'>
//               <ProductDetails product={product} />
//             </div>
//             <div className='space-y-4'>
//               <SellerInfo seller={product.seller} />
//               <ProductStats stats={product.stats} simpleView />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value='images'>
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Images</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ProductImages images={product.images} />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value='variations'>
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Variations</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ProductVariations variations={product.variations} />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value='stats'>
//           <ProductStats stats={product.stats} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default AdminProductDetails;
