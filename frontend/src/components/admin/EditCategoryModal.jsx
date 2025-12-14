import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Modal } from '../ui/Modal';
import { Backdrop } from '../ui/Backdrop';
import { Check, X, Loader2, Boxes } from 'lucide-react';

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'active',
        isFeatured: category.isFeatured || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        isFeatured: false,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const categoryData = {
        ...formData,
        id: category?.id || undefined,
      };

      await onSave(categoryData);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal isOpen={isOpen} onClose={onClose} className='max-w-md'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              type='button'
              onClick={onClose}
              className='text-gray-400 hover:text-gray-500'
              disabled={isSaving}>
              <X className='h-5 w-5' />
              <span className='sr-only'>Close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Category Name *</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='e.g. Electronics, Clothing'
                  className='mt-1'
                  disabled={isSaving}
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='A brief description of the category'
                  className='mt-1'
                  rows={3}
                  disabled={isSaving}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange('status', value)
                    }
                    disabled={isSaving}>
                    <SelectTrigger className='mt-1 w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex items-end'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='isFeatured'
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: checked,
                        }))
                      }
                      disabled={isSaving}
                    />
                    <Label htmlFor='isFeatured'>Featured</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSaving}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    {category ? 'Save Changes' : 'Create Category'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
