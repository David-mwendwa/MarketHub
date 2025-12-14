import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowLeft, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { Label } from '@components/ui/Label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import { Switch } from '@components/ui/Switch';
import { Checkbox } from '@components/ui/Checkbox';
import { Separator } from '@components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import categoriesData from '@/data/categories.json';

export function AddCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [isViewMode, setIsViewMode] = useState(false);
  const isEditMode = Boolean(id);

  // Check for view mode from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsViewMode(searchParams.get('view') === 'true');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      parent: undefined,
      description: '',
      shortDescription: '',
      isActive: true,
      isFeatured: false,
      showInNav: true,
      visibility: 'public',
      taxClass: 'standard',
      metaKeywords: [],
      image: { url: '', altText: '' },
      bannerImage: { url: '', altText: '' },
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      displayOrder: 0,
    },
  });

  // Load categories and category data if in edit mode
  useEffect(() => {
    setCategories(categoriesData);

    if (isEditMode) {
      const categoryToEdit = categoriesData.find(
        (cat) => cat._id === id || cat.id === id
      );
      if (categoryToEdit) {
        const formData = {
          ...categoryToEdit,
          parent: categoryToEdit.parentId || undefined,
          metaKeywords: categoryToEdit.metaKeywords || [],
          image: categoryToEdit.image || { url: '', altText: '' },
          bannerImage: categoryToEdit.bannerImage || { url: '', altText: '' },
          metaTitle: categoryToEdit.metaTitle || '',
          metaDescription: categoryToEdit.metaDescription || '',
          canonicalUrl: categoryToEdit.canonicalUrl || '',
          displayOrder: categoryToEdit.displayOrder || 0,
        };
        reset(formData);
      }
    }
  }, [id, isEditMode, reset]);

  const addKeyword = (e) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;

    const newKeywords = [...(watch('metaKeywords') || []), keywordInput.trim()];
    setValue('metaKeywords', newKeywords);
    setKeywordInput('');
  };

  const removeKeyword = (index) => {
    const newKeywords = [...(watch('metaKeywords') || [])];
    newKeywords.splice(index, 1);
    setValue('metaKeywords', newKeywords);
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setValue(field, {
          url: event.target.result,
          altText: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    setValue(field, { url: '', altText: '' });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      const url = isEditMode ? `/api/categories/${id}` : '/api/categories';
      const method = isEditMode ? 'PUT' : 'POST';

      // Prepare the data to be sent
      const categoryData = {
        ...data,
        // Ensure parentId is set correctly (convert 'root' to null/undefined if needed)
        parentId: data.parent === 'root' ? undefined : data.parent,
        // Ensure we don't send the parent field to the API
        ...(data.parent && {
          parentId: data.parent === 'root' ? null : data.parent,
        }),
      };

      // Remove the parent field as it's only used for the form
      delete categoryData.parent;

      console.log('Submitting:', { method, url, data: categoryData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would handle the API response here
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(categoryData),
      // });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Something went wrong');

      toast.success(
        `Category ${isEditMode ? 'updated' : 'created'} successfully`
      );
      navigate('/dashboard/admin/categories');
    } catch (error) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} category:`,
        error
      );
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} category`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = isViewMode
    ? 'View Category'
    : isEditMode
      ? 'Edit Category'
      : 'Add New Category';
  const submitButtonText = isViewMode
    ? 'Edit Category'
    : isEditMode
      ? 'Update Category'
      : 'Create Category';

  const handleSubmitButtonClick = (e) => {
    if (isViewMode) {
      e.preventDefault();
      setIsViewMode(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{pageTitle}</h1>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate(-1)}
          disabled={isLoading}
          className='text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Categories
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'>
          <TabsList className='bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg'>
            <TabsTrigger
              value='basic'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value='display'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Display
            </TabsTrigger>
            <TabsTrigger
              value='media'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              Media
            </TabsTrigger>
            <TabsTrigger
              value='seo'
              className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
              SEO
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value='basic' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set the basic information for your category.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='name'>
                        Name <span className='text-red-500'>*</span>
                      </Label>
                      <span className='text-xs text-muted-foreground'>
                        {watch('name')?.length || 0}/100
                      </span>
                    </div>
                    <Input
                      id='name'
                      placeholder='e.g., Electronics, Clothing, Home & Living'
                      {...register('name', {
                        required: 'Name is required',
                        maxLength: 100,
                      })}
                      className={`${errors.name ? 'border-red-500' : ''} ${isViewMode ? 'text-muted-foreground' : ''}`}
                      readOnly={isViewMode}
                      disabled={isViewMode}
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      A clear, descriptive name that helps customers find this
                      category
                    </p>
                    {errors.name && (
                      <p className='text-sm text-red-500'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='parent'>Parent Category</Label>
                    {isViewMode ? (
                      <Input
                        value={
                          watch('parent') === 'root'
                            ? 'Root (No Parent)'
                            : categories.find(
                                (cat) => cat._id === watch('parent')
                              )?.name || 'None'
                        }
                        readOnly
                        disabled
                      />
                    ) : (
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            'parent',
                            value === 'root' ? undefined : value
                          )
                        }
                        value={watch('parent') || 'root'}
                        disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a parent category' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='root'>Root (No Parent)</SelectItem>
                          {categories
                            .filter((cat) => !cat.parentId && cat._id !== id)
                            .map((category) => (
                              <SelectItem
                                key={category._id || category.id}
                                value={category._id || category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                    <p className='text-xs text-muted-foreground mt-1'>
                      Optional: Select a parent category to create a subcategory
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='shortDescription'>Short Description</Label>
                    <span className='text-xs text-muted-foreground'>
                      {watch('shortDescription')?.length || 0}/160
                    </span>
                  </div>
                  <Textarea
                    id='shortDescription'
                    placeholder='A brief summary of this category (max 160 characters)'
                    {...register('shortDescription', {
                      maxLength: 160,
                    })}
                    className='min-h-[80px] bg-background text-foreground border-input dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500'
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Keep it concise - this appears in category listings and
                    cards
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='description'>Description</Label>
                    <span className='text-xs text-muted-foreground'>
                      {watch('description')?.length || 0}/2000
                    </span>
                  </div>
                  <Textarea
                    id='description'
                    placeholder='Enter a detailed description of this category...'
                    {...register('description')}
                    className='min-h-[120px] bg-background text-foreground border-input dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500'
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Provide detailed information about this category. You can
                    include features, benefits, and any other relevant details.
                  </p>
                </div>

                <div className='flex items-center space-x-4 pt-2'>
                  <div className='flex items-center space-x-3 p-2 rounded-lg bg-muted/30 dark:bg-gray-800/50 border border-border'>
                    <div className='flex-1'>
                      <Label
                        htmlFor='isActive'
                        className='block text-sm font-medium text-muted-foreground mb-1'>
                        Status
                      </Label>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          id='isActive'
                          checked={watch('isActive')}
                          onCheckedChange={(checked) =>
                            !isViewMode && setValue('isActive', checked)
                          }
                          disabled={isViewMode}
                          className={`${watch('isActive') ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                        />
                        <Label htmlFor='isActive' className='font-medium'>
                          {watch('isActive') ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </div>

                    <Separator orientation='vertical' className='h-10' />

                    <div className='flex-1'>
                      <Label
                        htmlFor='isFeatured'
                        className='block text-sm font-medium text-muted-foreground mb-1'>
                        Featured
                      </Label>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          id='isFeatured'
                          checked={watch('isFeatured')}
                          onCheckedChange={(checked) =>
                            !isViewMode && setValue('isFeatured', checked)
                          }
                          disabled={isViewMode}
                          className={`${watch('isFeatured') ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                        />
                        <Label htmlFor='isFeatured' className='font-medium'>
                          {watch('isFeatured') ? 'Yes' : 'No'}
                        </Label>
                      </div>
                    </div>

                    <Separator orientation='vertical' className='h-10' />

                    <div className='flex-1'>
                      <Label
                        htmlFor='showInNav'
                        className='block text-sm font-medium text-muted-foreground mb-1'>
                        Navigation
                      </Label>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          id='showInNav'
                          checked={watch('showInNav')}
                          onCheckedChange={(checked) =>
                            !isViewMode && setValue('showInNav', checked)
                          }
                          disabled={isViewMode}
                          className={`${watch('showInNav') ? 'bg-purple-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                        />
                        <Label htmlFor='showInNav' className='font-medium'>
                          {watch('showInNav') ? 'Visible' : 'Hidden'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Settings Tab */}
          <TabsContent value='display' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Control how this category appears throughout your store.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='displayOrder'>Display Order</Label>
                    <Input
                      id='displayOrder'
                      type='number'
                      min='0'
                      placeholder='e.g., 1, 2, 3...'
                      {...register('displayOrder', { valueAsNumber: true })}
                      readOnly={isViewMode}
                      disabled={isViewMode}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Set the order in which this category appears in lists and
                      menus. Lower numbers appear first.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label>Visibility</Label>
                      <span className='text-xs text-muted-foreground'>
                        {watch('visibility') === 'public'
                          ? 'Visible to everyone'
                          : watch('visibility') === 'private'
                            ? 'Visible with direct link'
                            : 'Hidden from all users'}
                      </span>
                    </div>
                    {isViewMode ? (
                      <Input
                        value={
                          watch('visibility') === 'public'
                            ? 'Public'
                            : watch('visibility') === 'private'
                              ? 'Private'
                              : 'Hidden'
                        }
                        readOnly
                        disabled
                      />
                    ) : (
                      <Select
                        onValueChange={(value) => setValue('visibility', value)}
                        value={watch('visibility')}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select visibility' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='public'>
                            <div className='flex flex-col'>
                              <span>Public</span>
                              <span className='text-xs text-muted-foreground'>
                                Visible to all customers
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value='private'>
                            <div className='flex flex-col'>
                              <span>Private</span>
                              <span className='text-xs text-muted-foreground'>
                                Only visible with direct link
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value='hidden'>
                            <div className='flex flex-col'>
                              <span>Hidden</span>
                              <span className='text-xs text-muted-foreground'>
                                Only visible to admins
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <p className='text-xs text-muted-foreground'>
                      Control who can see this category in your store.
                    </p>
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='space-y-4'>
                  <h3 className='text-sm font-medium'>Category Status</h3>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 rounded-lg border'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='isActive' className='font-medium'>
                          Active
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          When inactive, this category will be hidden from the
                          store
                        </p>
                      </div>
                      <Switch
                        id='isActive'
                        checked={watch('isActive')}
                        onCheckedChange={(checked) =>
                          !isViewMode && setValue('isActive', checked)
                        }
                        disabled={isViewMode}
                        className={`${watch('isActive') ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                    </div>

                    <div className='flex items-center justify-between p-3 rounded-lg border'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='isFeatured' className='font-medium'>
                          Featured
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          Featured categories may be highlighted in special
                          sections
                        </p>
                      </div>
                      <Switch
                        id='isFeatured'
                        checked={watch('isFeatured')}
                        onCheckedChange={(checked) =>
                          !isViewMode && setValue('isFeatured', checked)
                        }
                        disabled={isViewMode}
                        className={`${watch('isFeatured') ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                    </div>

                    <div className='flex items-center justify-between p-3 rounded-lg border'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='showInNav' className='font-medium'>
                          Show in Navigation
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          Include this category in the main navigation menu
                        </p>
                      </div>
                      <Switch
                        id='showInNav'
                        checked={watch('showInNav')}
                        onCheckedChange={(checked) =>
                          !isViewMode && setValue('showInNav', checked)
                        }
                        disabled={isViewMode}
                        className={`${watch('showInNav') ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value='media' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                  Upload and manage images for your category. High-quality
                  images improve engagement and help customers find what they're
                  looking for.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label>Category Image</Label>
                        <span className='text-xs text-muted-foreground'>
                          {watch('image')?.url ? 'Image uploaded' : 'No image'}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground mb-2'>
                        This image represents your category in listings and
                        cards.
                      </p>
                      <div className='border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-48 hover:border-primary/50 transition-colors'>
                        {watch('image')?.url ? (
                          <div className='relative w-full h-full'>
                            <img
                              src={watch('image.url')}
                              alt={watch('image.altText') || 'Category Image'}
                              className='w-full h-full object-cover rounded'
                            />
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              className='absolute -top-2 -right-2 p-1 h-6 w-6 rounded-full'
                              onClick={() => removeImage('image')}
                              disabled={isViewMode}>
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center justify-center h-full text-center'>
                            <ImageIcon className='h-8 w-8 text-muted-foreground mb-2' />
                            <p className='text-sm text-muted-foreground text-center'>
                              Drag & drop an image here, or click to browse
                            </p>
                            <p className='text-xs text-muted-foreground mt-1 text-center'>
                              Recommended: 800×600px, JPG or PNG, max 2MB
                            </p>
                            <input
                              type='file'
                              accept='image/*'
                              className='hidden'
                              id='category-image-upload'
                              onChange={(e) => handleImageUpload(e, 'image')}
                              disabled={isViewMode}
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              onClick={() =>
                                document
                                  .getElementById('category-image-upload')
                                  .click()
                              }
                              disabled={isViewMode}>
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='imageAltText'>Image Alt Text</Label>
                        <span className='text-xs text-muted-foreground'>
                          {watch('image.altText')?.length || 0}/100
                        </span>
                      </div>
                      <Input
                        id='imageAltText'
                        placeholder='e.g., Electronics category showing various devices'
                        value={watch('image')?.altText || ''}
                        maxLength={100}
                        onChange={(e) =>
                          setValue('image', {
                            ...watch('image'),
                            altText: e.target.value,
                          })
                        }
                        readOnly={isViewMode}
                        disabled={isViewMode}
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Describe the image for accessibility and SEO. This text
                        is read by screen readers and search engines.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label>Banner Image</Label>
                        <span className='text-xs text-muted-foreground'>
                          {watch('bannerImage')?.url
                            ? 'Banner uploaded'
                            : 'No banner'}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground mb-2'>
                        This image appears as a full-width banner at the top of
                        your category page.
                      </p>
                      <div className='border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-48 hover:border-primary/50 transition-colors'>
                        {watch('bannerImage')?.url ? (
                          <div className='relative w-full h-full'>
                            <img
                              src={watch('bannerImage.url')}
                              alt={
                                watch('bannerImage.altText') || 'Banner Image'
                              }
                              className='w-full h-full object-cover rounded'
                            />
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              className='absolute -top-2 -right-2 p-1 h-6 w-6 rounded-full'
                              onClick={() => removeImage('bannerImage')}
                              disabled={isViewMode}>
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center justify-center h-full text-center'>
                            <ImageIcon className='h-8 w-8 text-muted-foreground mb-2' />
                            <p className='text-sm text-muted-foreground text-center'>
                              Drag & drop a banner here, or click to browse
                            </p>
                            <p className='text-xs text-muted-foreground mt-1 text-center'>
                              Recommended: 1920×400px, JPG or PNG, max 5MB
                            </p>
                            <input
                              type='file'
                              accept='image/*'
                              className='hidden'
                              id='banner-image-upload'
                              onChange={(e) =>
                                handleImageUpload(e, 'bannerImage')
                              }
                              disabled={isViewMode}
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              onClick={() =>
                                document
                                  .getElementById('banner-image-upload')
                                  .click()
                              }
                              disabled={isViewMode}>
                              Select Banner
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='bannerAltText'>Banner Alt Text</Label>
                        <span className='text-xs text-muted-foreground'>
                          {watch('bannerImage.altText')?.length || 0}/100
                        </span>
                      </div>
                      <Input
                        id='bannerAltText'
                        placeholder='e.g., Modern electronics banner with latest gadgets'
                        value={watch('bannerImage')?.altText || ''}
                        maxLength={100}
                        onChange={(e) =>
                          setValue('bannerImage', {
                            ...watch('bannerImage'),
                            altText: e.target.value,
                          })
                        }
                        readOnly={isViewMode}
                        disabled={isViewMode}
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Describe the banner for accessibility and SEO. This text
                        is read by screen readers and search engines.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value='seo' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
                <CardDescription>
                  Improve how your category appears in search engine results and
                  increase visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='metaTitle'>
                      Meta Title <span className='text-red-500'>*</span>
                    </Label>
                    <span className='text-xs text-muted-foreground'>
                      {watch('metaTitle')?.length || 0}/60
                    </span>
                  </div>
                  <Input
                    id='metaTitle'
                    placeholder='e.g., Buy Electronics Online | Your Store Name'
                    {...register('metaTitle', {
                      required: 'Meta title is required',
                      maxLength: 60,
                    })}
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                  <p className='text-xs text-muted-foreground'>
                    The title that appears in search results. Include your
                    primary keyword and keep it under 60 characters.
                  </p>
                  {errors.metaTitle && (
                    <p className='text-xs text-red-500'>
                      {errors.metaTitle.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='metaDescription'>Meta Description</Label>
                    <span className='text-xs text-muted-foreground'>
                      {watch('metaDescription')?.length || 0}/160
                    </span>
                  </div>
                  <Textarea
                    id='metaDescription'
                    placeholder='e.g., Shop our wide selection of high-quality electronics at competitive prices. Free shipping available on all orders.'
                    {...register('metaDescription', {
                      maxLength: 160,
                    })}
                    rows={3}
                    className='bg-background text-foreground border-input dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500'
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                  <p className='text-xs text-muted-foreground'>
                    A brief summary of the category that appears in search
                    results. Include your main keyword and a call to action.
                  </p>
                  {errors.metaDescription && (
                    <p className='text-xs text-red-500'>
                      {errors.metaDescription.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label>Meta Keywords</Label>
                  <div className='flex gap-2'>
                    {isViewMode ? (
                      <div className='flex flex-wrap gap-2'>
                        {watch('metaKeywords')?.length > 0 ? (
                          watch('metaKeywords').map((keyword, index) => (
                            <span
                              key={index}
                              className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800'>
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className='text-sm text-muted-foreground'>
                            No keywords
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className='grid gap-2'>
                        <div className='flex items-center gap-2'>
                          <Input
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder='Add a keyword'
                            className='flex-1'
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={addKeyword}
                            disabled={!keywordInput.trim()}
                            className='dark:bg-[rgb(55,65,81)] dark:border-gray-600 dark:hover:bg-[rgb(75,85,99)] dark:text-white'>
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {watch('metaKeywords')?.map((keyword, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800'>
                              <span>{keyword}</span>
                              <button
                                type='button'
                                onClick={() => removeKeyword(index)}
                                className='ml-1 rounded-full p-0.5 dark:bg-[rgb(55,65,81)] dark:border-gray-600 dark:hover:bg-[rgb(75,85,99)] dark:text-white'>
                                <X className='h-3.5 w-3.5' />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Add relevant keywords separated by commas. These help search
                    engines understand your content.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='canonicalUrl'>Canonical URL</Label>
                  <Input
                    id='canonicalUrl'
                    placeholder='https://yourstore.com/categories/electronics'
                    {...register('canonicalUrl', {
                      pattern: {
                        value: /^https?:\/\/[^\s/$.?#].*$/i,
                        message:
                          'Please enter a valid URL starting with http:// or https://',
                      },
                    })}
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                  <p className='text-xs text-muted-foreground'>
                    The preferred URL for this page if it has multiple URLs.
                    Should include the full path (e.g.,
                    https://example.com/category).
                  </p>
                  {errors.canonicalUrl && (
                    <p className='text-xs text-red-500'>
                      {errors.canonicalUrl.message}
                    </p>
                  )}
                </div>

                <div className='p-4 bg-muted/30 rounded-md mt-4'>
                  <h3 className='text-sm font-medium mb-2'>
                    Search Engine Results Preview
                  </h3>
                  <div className='space-y-1 text-sm'>
                    <p className='font-medium text-foreground line-clamp-1'>
                      {watch('metaTitle') || 'Your Page Title'}
                    </p>
                    <p className='text-muted-foreground text-xs line-clamp-2'>
                      {watch('metaDescription') ||
                        'A brief description of the page content that shows in search results.'}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      {watch('canonicalUrl')
                        ? new URL(watch('canonicalUrl')).hostname +
                          ' › ' +
                          watch('name')?.toLowerCase()?.replace(/\s+/g, '-')
                        : 'yourstore.com › ' +
                          (watch('name')?.toLowerCase()?.replace(/\s+/g, '-') ||
                            'category')}
                    </p>
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    This is an approximation of how your page might appear in
                    search results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className='flex justify-end space-x-2 pt-4 border-t mt-6'>
            <Button
              variant='outline'
              onClick={() => navigate(-1)}
              disabled={isLoading}
              type='button'>
              Cancel
            </Button>
            <Button
              type={isViewMode ? 'button' : 'submit'}
              onClick={isViewMode ? handleSubmitButtonClick : undefined}
              disabled={isLoading}
              className='w-full sm:w-auto'>
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : null}
              {submitButtonText}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}

export default AddCategory;
