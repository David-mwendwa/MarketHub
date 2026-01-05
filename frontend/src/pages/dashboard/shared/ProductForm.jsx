import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  Check,
  ExternalLink,
  Download,
  FileText,
  Tag,
  Truck,
  BarChart2,
  Settings,
  DollarSign,
  Package,
  Box,
  Hash,
  Barcode,
  Tag as TagIcon,
  Calendar,
  Percent,
  Globe,
  Link as LinkIcon,
  File,
  List,
  Type,
  Sliders,
  Info,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { Label } from '@components/ui/Label';
import { Separator } from '@components/ui/Separator';
import { ROUTES } from '@/constants/routes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

// Mock data - replace with API calls
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'toys', name: 'Toys & Games' },
];

const shippingClasses = [
  { id: 'standard', name: 'Standard' },
  { id: 'fragile', name: 'Fragile Items' },
  { id: 'oversized', name: 'Oversized Items' },
  { id: 'digital', name: 'Digital Product (No Shipping)' },
];

const taxClasses = [
  { id: 'standard', name: 'Standard Rate' },
  { id: 'reduced', name: 'Reduced Rate' },
  { id: 'zero', name: 'Zero Rate' },
];

const stockStatuses = [
  { id: 'instock', name: 'In Stock' },
  { id: 'outofstock', name: 'Out of Stock' },
  { id: 'onbackorder', name: 'On Backorder' },
];

const backorderOptions = [
  { id: 'no', name: 'Do not allow' },
  { id: 'notify', name: 'Allow, but notify customer' },
  { id: 'yes', name: 'Allow' },
];

const taxStatuses = [
  { id: 'taxable', name: 'Taxable' },
  { id: 'shipping', name: 'Shipping only' },
  { id: 'none', name: 'None' },
];

const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '3-5 business days',
    price: 4.99,
    availableFor: ['standard', 'fragile', 'oversized'],
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '1-2 business days',
    price: 9.99,
    availableFor: ['standard', 'fragile'],
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 19.99,
    availableFor: ['standard', 'fragile'],
  },
];

const ProductForm = ({ product, onSave, onCancel, isSaving = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [variations, setVariations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [salePriceDates, setSalePriceDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [backorders, setBackorders] = useState('no');
  const [soldIndividually, setSoldIndividually] = useState(false);
  const [enableReviews, setEnableReviews] = useState(true);
  const [purchaseNote, setPurchaseNote] = useState('');
  const [menuOrder, setMenuOrder] = useState(0);
  const [customFields, setCustomFields] = useState([{ key: '', value: '' }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      sku: '',
      status: 'draft',
      isFeatured: false,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      isMain: images.length === 0, // First image is main by default
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Reset file input to allow selecting the same file again
    if (e.target.files) {
      e.target.value = '';
    }
  };

  const setMainImage = (id) => {
    setImages(
      images.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        id: Date.now().toString(),
        name: '',
        options: [],
        values: [''],
      },
    ]);
  };

  const removeVariation = (id) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(data);
      } else {
        console.log('Form submitted:', data);
        // Default behavior if no onSave handler is provided
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Navigate to products list on success
        navigate(ROUTES.DASHBOARD.SELLER_PRODUCTS);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-foreground'>
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Button
          variant='ghost'
          size='sm'
          onClick={onCancel}
          className='text-muted-foreground hover:text-foreground border border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
      </div>

      <form
        id='product-form'
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-4'>
          <TabsList className='bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg'>
            <TabsTrigger
              value='basic'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value='inventory'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value='pricing'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value='shipping'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value='media'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Media
            </TabsTrigger>
            <TabsTrigger
              value='variations'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Variations
            </TabsTrigger>
            <TabsTrigger
              value='seo'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              SEO
            </TabsTrigger>
            <TabsTrigger
              value='advanced'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value='basic' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Basic Information</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Essential details about your product. Fields marked with{' '}
                  <span className='text-destructive'>*</span> are required.
                </p>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Product Name */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='name' className='flex items-center'>
                      Product Name <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <span className='text-xs text-gray-500'>
                      {watch('name')?.length || 0}/100
                    </span>
                  </div>
                  <Input
                    id='name'
                    placeholder='e.g., Premium Cotton T-Shirt'
                    maxLength={100}
                    {...register('name', {
                      required: 'Product name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Name must be less than 100 characters',
                      },
                    })}
                    error={errors.name?.message}
                  />
                  <p className='text-xs text-gray-500'>
                    A clear and descriptive product name helps customers find
                    your product.
                  </p>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label
                      htmlFor='description'
                      className='text-gray-900 dark:text-gray-100'>
                      Description
                    </Label>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      {watch('description')?.length || 0}/2000
                    </span>
                  </div>
                  <Textarea
                    id='description'
                    placeholder='Enter detailed product description...'
                    rows={5}
                    maxLength={2000}
                    className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    {...register('description', {
                      maxLength: {
                        value: 2000,
                        message:
                          'Description must be less than 2000 characters',
                      },
                    })}
                    error={errors.description?.message}
                  />
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Describe your product in detail. Include features, benefits,
                    and any other relevant information.
                  </p>
                </div>

                {/* Pricing & Category */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='price' className='flex items-center'>
                      Price <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <span className='text-gray-500 sm:text-sm'>$</span>
                      </div>
                      <Input
                        id='price'
                        type='number'
                        step='0.01'
                        min='0'
                        placeholder='0.00'
                        className='pl-7'
                        {...register('price', {
                          required: 'Price is required',
                          min: {
                            value: 0.01,
                            message: 'Price must be greater than 0',
                          },
                          max: {
                            value: 1000000,
                            message: 'Price must be less than 1,000,000',
                          },
                        })}
                        error={errors.price?.message}
                      />
                    </div>
                    <p className='text-xs text-gray-500'>
                      Set the base price for this product.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='category' className='flex items-center'>
                      Category <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue('category', value, { shouldValidate: true })
                      }
                      defaultValue={watch('category')}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Options */}
                <div className='space-y-4 pt-2'>
                  <h3 className='text-sm font-medium'>Product Visibility</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start'>
                      <div className='flex items-center h-5'>
                        <input
                          id='isFeatured'
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                          {...register('isFeatured')}
                        />
                      </div>
                      <div className='ml-3 text-sm'>
                        <Label
                          htmlFor='isFeatured'
                          className='font-medium text-gray-700'>
                          Feature this product
                        </Label>
                        <p className='text-gray-500'>
                          Show this product in featured sections across the
                          store.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value='inventory' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Inventory</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Manage stock levels, SKUs, and backorders for your product.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='sku'>SKU (Stock Keeping Unit)</Label>
                    <Input
                      id='sku'
                      placeholder='e.g., PROD-123'
                      {...register('sku')}
                    />
                    <p className='text-xs text-gray-500'>
                      A unique identifier for this product. Leave blank to
                      auto-generate.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='barcode'>
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </Label>
                    <Input
                      id='barcode'
                      placeholder='e.g., 123456789012'
                      {...register('barcode')}
                    />
                    <p className='text-xs text-gray-500'>
                      Enter the product's barcode number for inventory
                      management.
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='stockQuantity'>Stock quantity</Label>
                    <Input
                      id='stockQuantity'
                      type='number'
                      min='0'
                      {...register('stockQuantity')}
                    />
                    <p className='text-xs text-gray-500'>
                      Current stock level. Leave empty if not tracking
                      inventory.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='stockStatus'>Stock status</Label>
                    <Select
                      onValueChange={(value) => setValue('stockStatus', value)}
                      defaultValue={watch('stockStatus') || 'instock'}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        {stockStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-500'>
                      Controls whether the product is in stock or available for
                      backorder.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='backorders'>Allow backorders</Label>
                    <Select value={backorders} onValueChange={setBackorders}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backorderOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-500'>
                      Allow customers to purchase products that are out of
                      stock.
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='soldIndividually'
                      checked={soldIndividually}
                      onChange={(e) => setSoldIndividually(e.target.checked)}
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                    />
                    <Label
                      htmlFor='soldIndividually'
                      className='text-sm font-medium'>
                      Sold individually
                    </Label>
                  </div>
                  <p className='text-xs text-gray-500'>
                    Enable this to only allow one of this item to be bought in a
                    single order
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value='pricing' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Pricing</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Set your product's price, sale information, and tax options.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='regularPrice'>Regular price ($)</Label>
                    <Input
                      id='regularPrice'
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder='0.00'
                      {...register('regularPrice', {
                        required: 'Regular price is required',
                      })}
                    />
                    <p className='text-xs text-gray-500'>
                      The normal price of the product before any discounts.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='salePrice'>Sale price ($)</Label>
                    <div className='relative'>
                      <Input
                        id='salePrice'
                        type='number'
                        step='0.01'
                        min='0'
                        placeholder='0.00'
                        {...register('salePrice')}
                      />
                    </div>
                    <p className='text-xs text-gray-500'>
                      Set a sale price to show a discounted price. Leave empty
                      to disable sale pricing.
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Sale start date</Label>
                    <Input
                      type='datetime-local'
                      value={salePriceDates.startDate}
                      onChange={(e) =>
                        setSalePriceDates((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                    <p className='text-xs text-gray-500'>
                      Schedule the sale to start at a specific date and time.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label>Sale end date</Label>
                    <Input
                      type='datetime-local'
                      value={salePriceDates.endDate}
                      onChange={(e) =>
                        setSalePriceDates((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      min={salePriceDates.startDate}
                    />
                    <p className='text-xs text-gray-500'>
                      Set an end date to automatically stop the sale.
                    </p>
                  </div>
                </div>

                <div className='border-t pt-4'>
                  <h3 className='font-medium mb-3'>Tax</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Tax status</Label>
                      <Select
                        onValueChange={(value) => setValue('taxStatus', value)}
                        defaultValue={watch('taxStatus') || 'taxable'}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          {taxStatuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className='text-xs text-gray-500'>
                        Define if taxes apply to this product.
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label>Tax class</Label>
                      <Select
                        onValueChange={(value) => setValue('taxClass', value)}
                        defaultValue={watch('taxClass') || 'standard'}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select class' />
                        </SelectTrigger>
                        <SelectContent>
                          {taxClasses.map((taxClass) => (
                            <SelectItem key={taxClass.id} value={taxClass.id}>
                              {taxClass.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className='text-xs text-gray-500'>
                        Choose a tax class for this product. Standard rate
                        applies to most products.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value='media' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Media</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Upload high-quality images to showcase your product. The first
                  image will be used as the main product image.
                </p>
              </CardHeader>
              <CardContent>
                {/* Drag and Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length > 0) {
                      handleImageUpload({
                        target: { files: e.dataTransfer.files },
                      });
                    }
                  }}>
                  <div className='flex flex-col items-center justify-center space-y-2'>
                    <div className='p-3 bg-indigo-100 rounded-full'>
                      <Upload className='h-6 w-6 text-indigo-600' />
                    </div>
                    <div className='text-sm'>
                      <label
                        htmlFor='image-upload'
                        className='relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none'>
                        <span>Upload files</span>
                        <input
                          id='image-upload'
                          name='image-upload'
                          type='file'
                          className='sr-only'
                          multiple
                          accept='image/jpeg, image/png, image/webp, image/gif'
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className='text-gray-600'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-gray-500'>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-sm font-medium text-gray-700 mb-3'>
                      Product Images ({images.length} of 10)
                    </h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          className={`relative group rounded-lg overflow-hidden bg-gray-100 aspect-square ${
                            img.isMain
                              ? 'ring-2 ring-offset-2 ring-indigo-500'
                              : ''
                          }`}>
                          <img
                            src={img.url}
                            alt={`Product preview ${index + 1}`}
                            className='w-full h-full object-cover transition-transform duration-200 group-hover:scale-105'
                            onClick={() => {
                              // Open image in a modal or lightbox
                              // This would be implemented with a modal component
                              console.log('Open image:', img.url);
                            }}
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2'>
                            <div className='flex justify-end space-x-1'>
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMainImage(img.id);
                                }}
                                className={`p-1.5 rounded-full ${
                                  img.isMain
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white/80 text-gray-700 hover:bg-white'
                                }`}
                                title={
                                  img.isMain
                                    ? 'Main image'
                                    : 'Set as main image'
                                }>
                                <Check className='h-3.5 w-3.5' />
                              </button>
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(img.id);
                                }}
                                className='p-1.5 bg-white/80 rounded-full text-red-600 hover:bg-white hover:text-red-700'
                                title='Remove image'>
                                <Trash2 className='h-3.5 w-3.5' />
                              </button>
                            </div>
                            <div className='text-white text-xs bg-black/50 px-2 py-1 rounded self-start'>
                              {index === 0 ? 'Main' : `#${index + 1}`}
                            </div>
                          </div>
                        </div>
                      ))}

                      {images.length < 10 && (
                        <label
                          htmlFor='image-upload'
                          className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors aspect-square'>
                          <Plus className='h-6 w-6 text-gray-400' />
                          <span className='mt-2 text-sm text-gray-600'>
                            Add more
                          </span>
                        </label>
                      )}
                    </div>

                    <div className='mt-4 text-xs text-gray-500'>
                      <p>
                        • First image will be used as the main product image
                      </p>
                      <p>• You can reorder images by dragging and dropping</p>
                      <p>• Maximum 10 images per product</p>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <h4 className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
                    Image Guidelines
                  </h4>
                  <ul className='text-xs text-gray-600 dark:text-gray-300 space-y-1'>
                    <li className='flex items-start'>
                      <span className='mr-1'>•</span>
                      <span>Use high-quality, well-lit product photos</span>
                    </li>
                    <li className='flex items-start'>
                      <span className='mr-1'>•</span>
                      <span>Show different angles and details</span>
                    </li>
                    <li className='flex items-start'>
                      <span className='mr-1'>•</span>
                      <span>
                        Use square or 4:5 aspect ratio for best results
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='mr-1'>•</span>
                      <span>Minimum recommended size: 800x800px</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variations Tab */}
          <TabsContent value='variations' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Variations</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Create product variants with different attributes like size,
                  color, or style. Each variation can have its own price, SKU,
                  and inventory.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                {variations.length === 0 ? (
                  <div className='text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50'>
                    <Package className='h-12 w-12 mx-auto text-gray-400' />
                    <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                      No variations added yet
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Get started by adding your first variation.
                    </p>
                    <div className='mt-6'>
                      <Button
                        type='button'
                        onClick={addVariation}
                        variant='outline'
                        className='inline-flex items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Variation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {variations.map((variation, index) => (
                      <div
                        key={variation.id}
                        className='border rounded-lg p-4 space-y-4'>
                        <div className='flex justify-between items-center'>
                          <h4 className='font-medium'>Variation {index + 1}</h4>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariation(variation.id);
                            }}
                            className='text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50'>
                            <Trash2 className='h-4 w-4 mr-1' />
                            <span>Remove</span>
                          </Button>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <div className='space-y-1'>
                              <Label>Variation Name</Label>
                              <Input
                                placeholder='e.g., Color, Size, Material'
                                value={variation.name}
                                onChange={(e) => {
                                  const newVariations = [...variations];
                                  newVariations[index].name = e.target.value;
                                  setVariations(newVariations);
                                }}
                              />
                              <p className='text-xs text-gray-500'>
                                Name of the variation attribute (e.g., Color,
                                Size, Material). This will be displayed to
                                customers.
                              </p>
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <div className='space-y-1'>
                              <Label>Options (comma separated)</Label>
                              <Input
                                placeholder='e.g., Red, Blue, Green or Small, Medium, Large'
                                value={variation.values?.join(', ')}
                                onChange={(e) => {
                                  const newVariations = [...variations];
                                  newVariations[index].values = e.target.value
                                    .split(',')
                                    .map((v) => v.trim())
                                    .filter(Boolean);
                                  setVariations(newVariations);
                                }}
                              />
                              <p className='text-xs text-gray-500'>
                                Enter all possible values for this variation,
                                separated by commas. Each value will create a
                                selectable option for customers.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='pt-4 border-t'>
                          <div className='mb-3'>
                            <h5 className='text-sm font-medium'>
                              Pricing & Inventory
                            </h5>
                            <p className='text-xs text-gray-500'>
                              Set specific pricing and inventory for this
                              variation. Leave empty to use the main product's
                              price and stock.
                            </p>
                          </div>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='space-y-2'>
                              <div className='space-y-1'>
                                <Label>Price ($)</Label>
                                <Input
                                  type='number'
                                  step='0.01'
                                  min='0'
                                  placeholder='0.00'
                                  value={variation.price || ''}
                                  onChange={(e) => {
                                    const newVariations = [...variations];
                                    newVariations[index].price = e.target.value;
                                    setVariations(newVariations);
                                  }}
                                />
                                <p className='text-xs text-gray-500'>
                                  Set a custom price for this variation. If left
                                  empty, the main product price will be used.
                                </p>
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <div className='space-y-1'>
                                <Label>Stock Quantity</Label>
                                <Input
                                  type='number'
                                  min='0'
                                  placeholder='0'
                                  value={variation.stock || ''}
                                  onChange={(e) => {
                                    const newVariations = [...variations];
                                    newVariations[index].stock = e.target.value;
                                    setVariations(newVariations);
                                  }}
                                />
                                <p className='text-xs text-gray-500'>
                                  Set the available quantity for this specific
                                  variation. Leave empty to use the main
                                  product's stock.
                                </p>
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <div className='space-y-1'>
                                <Label>SKU</Label>
                                <Input
                                  placeholder='e.g., TSHIRT-RED-M'
                                  value={variation.sku || ''}
                                  onChange={(e) => {
                                    const newVariations = [...variations];
                                    newVariations[index].sku = e.target.value;
                                    setVariations(newVariations);
                                  }}
                                />
                                <p className='text-xs text-gray-500'>
                                  A unique SKU for this variation. If left
                                  empty, one will be generated automatically.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      onClick={addVariation}
                      className='w-full mt-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700'>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Another Variation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value='shipping' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Shipping</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Set up shipping dimensions, weight, and class for physical
                  products.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='isVirtual'
                      checked={isVirtual}
                      onChange={(e) => setIsVirtual(e.target.checked)}
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                    />
                    <Label htmlFor='isVirtual' className='text-sm font-medium'>
                      Virtual product
                    </Label>
                  </div>
                  <p className='text-xs text-gray-500'>
                    Enable this option if this is a non-physical product, e.g.
                    services, digital products, or subscriptions.
                  </p>
                </div>

                {!isVirtual && (
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='weight'>Weight (kg)</Label>
                        <Input
                          id='weight'
                          type='number'
                          step='0.01'
                          min='0'
                          placeholder='0.00'
                          {...register('weight')}
                        />
                        <p className='text-xs text-gray-500'>
                          Product weight in kilograms. Used to calculate
                          shipping costs.
                        </p>
                      </div>

                      <div className='space-y-2'>
                        <Label>Dimensions (cm)</Label>
                        <div className='grid grid-cols-3 gap-2'>
                          <Input
                            placeholder='Length'
                            {...register('dimensions.length')}
                          />
                          <Input
                            placeholder='Width'
                            {...register('dimensions.width')}
                          />
                          <Input
                            placeholder='Height'
                            {...register('dimensions.height')}
                          />
                        </div>
                        <p className='text-xs text-gray-500'>
                          Product dimensions in centimeters (L × W × H). Used
                          for shipping calculations.
                        </p>
                      </div>

                      <div className='space-y-2'>
                        <Label>Shipping class</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('shippingClass', value)
                          }
                          defaultValue={watch('shippingClass')}>
                          <SelectTrigger>
                            <SelectValue placeholder='No shipping class' />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingClasses.map((shippingClass) => (
                              <SelectItem
                                key={shippingClass.id}
                                value={shippingClass.id}>
                                {shippingClass.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-gray-500'>
                          Shipping classes group products with similar shipping
                          requirements. For example, fragile items might require
                          special handling.
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div>
                        <Label>Shipping Methods</Label>
                        <p className='text-xs text-gray-500 mb-2'>
                          Select which shipping methods are available for this
                          product. Options update based on the shipping class.
                        </p>
                      </div>
                      <div className='space-y-3'>
                        {shippingOptions
                          .filter((option) =>
                            option.availableFor.includes(
                              watch('shippingClass') || 'standard'
                            )
                          )
                          .map((option) => (
                            <div key={option.id} className='flex items-start'>
                              <div className='flex items-center h-5'>
                                <input
                                  type='checkbox'
                                  id={`shipping-${option.id}`}
                                  defaultChecked
                                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5'
                                  {...register(`shippingMethods.${option.id}`)}
                                />
                              </div>
                              <div className='ml-3 text-sm'>
                                <Label
                                  htmlFor={`shipping-${option.id}`}
                                  className='font-medium text-gray-700'>
                                  {option.name} - ${option.price.toFixed(2)}
                                </Label>
                                <p className='text-gray-500 text-xs'>
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value='seo' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>
                  Search Engine Optimization (SEO)
                </CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Improve how your product appears in search engine results.
                  These settings help search engines understand and display your
                  product.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='seoTitle'>Meta Title</Label>
                    <Input
                      id='seoTitle'
                      placeholder='Enter meta title (60 characters max)'
                      maxLength={60}
                      {...register('seoTitle')}
                    />
                    <p className='text-xs text-gray-500'>
                      Recommended: 50-60 characters. This sets the title that
                      appears in search results and browser tabs. Include your
                      primary keyword for better SEO.
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <Label
                      htmlFor='seoDescription'
                      className='text-gray-900 dark:text-gray-100'>
                      Meta Description
                    </Label>
                    <Textarea
                      id='seoDescription'
                      placeholder='Enter meta description (160 characters max)'
                      rows={3}
                      maxLength={160}
                      className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      {...register('seoDescription')}
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Recommended: 120-160 characters. A brief summary of your
                      product that appears in search results. Make it compelling
                      to improve click-through rates from search engines.
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='seoKeywords'>Keywords</Label>
                    <Input
                      id='seoKeywords'
                      placeholder='Enter keywords (comma separated)'
                      {...register('seoKeywords')}
                    />
                    <p className='text-xs text-gray-500'>
                      Add relevant keywords that customers might use to find
                      this product. Separate multiple keywords with commas.
                    </p>
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='seoSlug'>URL Slug</Label>
                  <div className='flex'>
                    <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                      /products/
                    </span>
                    <Input
                      id='seoSlug'
                      className='rounded-l-none'
                      placeholder='product-name'
                      {...register('slug')}
                    />
                  </div>
                  <p className='text-xs text-gray-500'>
                    The part of the URL that identifies this product. Use
                    lowercase letters, numbers, and hyphens only. Leave empty to
                    auto-generate from the product name.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value='advanced' className='space-y-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl'>Advanced Settings</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Configure advanced product options and settings for your
                  products.
                </p>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <Label
                      htmlFor='purchaseNote'
                      className='text-gray-900 dark:text-gray-100'>
                      Purchase Note
                    </Label>
                    <Textarea
                      id='purchaseNote'
                      placeholder='Enter a note to the customer'
                      rows={3}
                      value={purchaseNote}
                      onChange={(e) => setPurchaseNote(e.target.value)}
                      className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      A short note to include with the order confirmation email.
                      This could include important information about the product
                      or delivery.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <div className='flex items-start space-x-2'>
                    <div className='flex items-center h-5 mt-0.5'>
                      <input
                        type='checkbox'
                        id='enableReviews'
                        checked={enableReviews}
                        onChange={(e) => setEnableReviews(e.target.checked)}
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label
                        htmlFor='enableReviews'
                        className='text-sm font-medium'>
                        Enable reviews
                      </Label>
                      <p className='text-xs text-gray-500'>
                        Allow customers to submit reviews on this product.
                        Disabling this will hide the review section and prevent
                        new reviews from being submitted.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-start space-x-2'>
                    <div className='flex items-center h-5 mt-0.5'>
                      <input
                        type='checkbox'
                        id='isDownloadable'
                        checked={isDownloadable}
                        onChange={(e) => setIsDownloadable(e.target.checked)}
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label
                        htmlFor='isDownloadable'
                        className='text-sm font-medium'>
                        Downloadable product
                      </Label>
                      <p className='text-xs text-gray-500'>
                        Enable this option if this is a digital product with
                        downloadable files. You'll be able to add downloadable
                        files that customers can access after purchase.
                      </p>
                    </div>
                  </div>
                </div>

                {isDownloadable && (
                  <div className='space-y-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800'>
                    <h4 className='font-medium text-gray-900 dark:text-white'>
                      Downloadable files
                    </h4>
                    {downloadableFiles.map((file, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <Input
                          placeholder='File name'
                          value={file.name}
                          onChange={(e) => {
                            const newFiles = [...downloadableFiles];
                            newFiles[index].name = e.target.value;
                            setDownloadableFiles(newFiles);
                          }}
                          className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                        />
                        <Input
                          type='file'
                          onChange={(e) => {
                            const newFiles = [...downloadableFiles];
                            newFiles[index].file = e.target.files[0];
                            setDownloadableFiles(newFiles);
                          }}
                          className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 file:border-0 file:mr-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:rounded-md'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          onClick={() => {
                            const newFiles = [...downloadableFiles];
                            newFiles.splice(index, 1);
                            setDownloadableFiles(newFiles);
                          }}>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                      onClick={() =>
                        setDownloadableFiles([
                          ...downloadableFiles,
                          { name: '', file: null },
                        ])
                      }>
                      <Plus className='h-4 w-4 mr-2' />
                      Add File
                    </Button>
                  </div>
                )}

                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='menuOrder'>Menu order</Label>
                    <Input
                      id='menuOrder'
                      type='number'
                      min='0'
                      value={menuOrder}
                      onChange={(e) =>
                        setMenuOrder(parseInt(e.target.value) || 0)
                      }
                    />
                    <p className='text-xs text-gray-500'>
                      Set a custom order for this product. Products are sorted
                      from lowest to highest number. Use this to control the
                      display order in product listings and widgets.
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <h4 className='font-medium'>Custom Fields</h4>
                    <p className='text-xs text-gray-500'>
                      Add custom metadata to this product. These fields will be
                      displayed in the product's additional information section.
                    </p>
                  </div>
                  <div className='space-y-2'>
                    {customFields.map((field, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50'>
                        <div className='flex-1'>
                          <Input
                            placeholder='Field name'
                            value={field.key}
                            onChange={(e) => {
                              const newFields = [...customFields];
                              newFields[index].key = e.target.value;
                              setCustomFields(newFields);
                            }}
                            className='bg-white dark:bg-gray-800'
                          />
                        </div>
                        <div className='flex-1'>
                          <Input
                            placeholder='Field value'
                            value={field.value}
                            onChange={(e) => {
                              const newFields = [...customFields];
                              newFields[index].value = e.target.value;
                              setCustomFields(newFields);
                            }}
                            className='bg-white dark:bg-gray-800'
                          />
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={(e) => {
                            e.stopPropagation();
                            const newFields = [...customFields];
                            newFields.splice(index, 1);
                            setCustomFields(newFields);
                          }}
                          className='h-9 w-9 p-0 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCustomFields([
                          ...customFields,
                          { key: '', value: '' },
                        ])
                      }
                      className='dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700'>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Custom Field
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className='flex justify-end space-x-2 pt-4 border-t mt-6'>
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
            type='button'>
            Cancel
          </Button>
          <Button
            type='submit'
            form='product-form'
            disabled={isLoading}
            isLoading={isLoading}
            className='min-w-[120px]'>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
