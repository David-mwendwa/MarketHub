import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/UICard';
import { ROUTES } from '../../../constants/routes';
import { ICONS } from '../../../constants/icons';
import {
  eastAfricanCountries,
  regionsByCountry,
} from '../../../constants/countries';
import * as LucideIcons from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { AlertTriangle } from 'lucide-react';

// Import specific icons we need from Lucide
const { Home, Briefcase, MapPin, HelpCircle, Plus } = LucideIcons;

// Create a mapping of icon names to their Lucide components
const Icon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name] || HelpCircle;
  return <LucideIcon {...props} />;
};

// Address type configuration with direct Lucide icon components
const ADDRESS_TYPES = [
  {
    value: 'home',
    label: 'Home',
    icon: Home,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    value: 'work',
    label: 'Work',
    icon: Briefcase,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    value: 'other',
    label: 'Other',
    icon: MapPin,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
];

const Addresses = () => {
  const { profile, updateProfile, isLoading } = useUser();
  const [addresses, setAddresses] = useState(profile?.user?.addresses || []);
  const [isEditing, setIsEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home',
    isDefault: false,
    firstName: '',
    lastName: '',
    company: '',
    address1: '', // street address
    address2: '', // apartment, suite, etc.
    city: '',
    state: '',
    postalCode: '',
    country: 'Kenya',
    countryCode: '254',
    phone: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (profile?.user?.addresses) {
      setAddresses(profile.user.addresses);
    }
  }, [profile]);

  console.log('PROFILE', profile);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    // If country changes, reset city
    if (name === 'country') {
      newFormData.city = '';
    }

    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'address1',
      'city',
      'state',
      'country',
      'phone',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Phone number validation (only if provided)
    if (formData.phone) {
      const phoneRegex = /^[0-9]{9,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let updatedAddresses;
      const newAddress = {
        type: formData.type,
        isDefault: formData.isDefault,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company?.trim() || '',
        address1: formData.address1.trim(),
        address2: formData.address2?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode?.trim() || '',
        country: formData.country,
        phone: formData.phone.trim(),
        additionalInfo: formData.additionalInfo?.trim() || '',
      };

      if (isEditing) {
        // Update existing address
        updatedAddresses = addresses.map((addr) =>
          addr._id === formData._id
            ? { ...newAddress, _id: formData._id }
            : addr
        );
      } else {
        // Add new address
        updatedAddresses = [...addresses, { ...newAddress }];
      }

      // If this is set as default, update other addresses
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === formData._id,
        }));
      }

      // Update the profile with the updated addresses array
      const response = await updateProfile({ addresses: updatedAddresses });

      // Update local state with the response from the server
      if (response && response.user && response.user.addresses) {
        setAddresses(response.user.addresses);
      } else {
        // Fallback to local state if server response doesn't contain addresses
        setAddresses(updatedAddresses);
      }

      toast.success(
        isEditing
          ? 'Address updated successfully'
          : 'Address added successfully'
      );
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      type: 'home',
      isDefault: false,
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      countryCode: '254',
      phone: '',
      additionalInfo: '',
    });
    setIsEditing(null);
    setShowAddForm(false);
    setErrors({});
  };

  // Edit an address
  const handleEdit = (address) => {
    setFormData({
      _id: address._id,
      type: address.type || 'home',
      isDefault: address.isDefault || false,
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Kenya',
      countryCode: address.countryCode || '254',
      phone: address.phone || '',
      additionalInfo: address.additionalInfo || '',
    });
    setIsEditing(address._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      setIsDeleting(true);
      const updatedAddresses = addresses.filter(
        (addr) => addr._id !== addressToDelete
      );
      await updateProfile({ addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully');
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Set as default address
  const setAsDefault = async (id) => {
    try {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === id,
      }));

      await updateProfile({ addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error updating default address:', error);
      toast.error('Failed to update default address');
    }
  };

  // Format phone number for display based on country code
  const formatPhoneNumber = (phone, countryCode = '254') => {
    if (!phone) return '';

    // Convert to string and remove all non-digit characters
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Remove leading 0 if present
    const normalizedPhone = cleaned.startsWith('0')
      ? cleaned.substring(1)
      : cleaned;

    // Get country info for formatting
    const country = eastAfricanCountries.find(
      (c) => c.dialCode === `+${countryCode}`
    ) || { dialCode: `+${countryCode}` };

    // Format based on country code
    switch (country.dialCode) {
      case '+254': // Kenya
        if (normalizedPhone.length === 9) {
          // Format as 7XX XXX XXX
          const match = normalizedPhone.match(/^(\d{3})(\d{3})(\d{3})$/);
          return match
            ? `${country.dialCode} ${match[1]} ${match[2]} ${match[3]}`
            : `${country.dialCode} ${normalizedPhone}`;
        } else if (
          normalizedPhone.length === 10 &&
          normalizedPhone.startsWith('0')
        ) {
          // Handle case where number still has leading 0
          const cleanNumber = normalizedPhone.substring(1);
          const match = cleanNumber.match(/^(\d{2})(\d{3})(\d{3})$/);
          return match
            ? `${country.dialCode} ${cleanNumber[0]}${match[1]} ${match[2]} ${match[3]}`
            : `${country.dialCode} ${cleanNumber}`;
        }
        break;

      case '+255': // Tanzania
      case '+256': // Uganda
      case '+250': // Rwanda
      case '+257': // Burundi
      case '+211': // South Sudan
        // For other countries, just ensure country code is added once
        if (normalizedPhone.startsWith(countryCode)) {
          return `+${normalizedPhone}`;
        }
        return `${country.dialCode} ${normalizedPhone}`;

      default:
        // For unknown country codes, just ensure proper formatting
        if (normalizedPhone.startsWith(countryCode)) {
          return `+${normalizedPhone}`;
        }
        return `${country.dialCode} ${normalizedPhone}`;
    }

    // Fallback for any unhandled cases
    if (normalizedPhone.startsWith(countryCode)) {
      return `+${normalizedPhone}`;
    }
    return `${country.dialCode} ${normalizedPhone}`;
  };

  // Render address card
  const renderAddressCard = (address) => {
    const addressType =
      ADDRESS_TYPES.find((type) => type.value === address.type) ||
      ADDRESS_TYPES[0];
    const IconComponent = addressType.icon || HelpCircle;

    return (
      <Card
        key={address._id}
        className={`relative overflow-hidden transition-all hover:shadow-md dark:border-gray-700 ${
          address.isDefault
            ? 'border-2 border-blue-500 dark:border-blue-600'
            : 'border-gray-200'
        }`}>
        {address.isDefault && (
          <div className='absolute right-0 top-0 rounded-bl-md bg-blue-600 px-3 py-1 text-xs font-medium text-white'>
            Default
          </div>
        )}

        <CardHeader className='pb-2'>
          <div className='flex items-center'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${addressType.bgColor} ${addressType.color}`}>
              <IconComponent className='h-5 w-5' />
            </div>
            <div className='ml-3'>
              <CardTitle className='text-lg font-medium text-gray-900 dark:text-white'>
                {address.firstName} {address.lastName}
              </CardTitle>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {addressType.label}
                {address.company && ` • ${address.company}`}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-2'>
          <div className='space-y-2 text-sm text-gray-700 dark:text-gray-300'>
            <p className='flex items-start'>
              <Icon
                name='MAP_PIN'
                className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5'
              />
              <span>
                <span className='block'>{address.address1}</span>
                {address.address2 && (
                  <span className='block'>{address.address2}</span>
                )}
              </span>
            </p>

            <p className='flex items-start'>
              <Icon
                name='MAP_PIN'
                className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 opacity-0'
              />
              <span>
                {[address.city, address.state].filter(Boolean).join(', ')}
                {address.postalCode && `, ${address.postalCode}`}
                {address.country && (
                  <span className='block text-gray-500 dark:text-gray-400'>
                    {address.country}
                  </span>
                )}
              </span>
            </p>

            <p className='flex items-center'>
              <Icon
                name='PHONE'
                className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400'
              />
              {formatPhoneNumber(address.phone, address.countryCode)}
            </p>

            {address.additionalInfo && (
              <div className='mt-2 rounded bg-gray-50 p-2 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-300'>
                <p className='font-medium'>Delivery Instructions:</p>
                <p>{address.additionalInfo}</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex flex-wrap justify-between gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700'>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleEdit(address)}
              className='text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800'>
              <Icon name='EDIT' className='mr-1 h-4 w-4' />
              <span className='sr-only sm:not-sr-only sm:ml-1'>Edit</span>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteClick(address._id)}
              className='text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800'>
              <Icon name='TRASH_2' className='mr-1 h-4 w-4' />
              <span className='sr-only sm:not-sr-only sm:ml-1'>Delete</span>
            </Button>
          </div>

          {!address.isDefault && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAsDefault(address._id)}
              className='text-sm'>
              Set as Default
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className='w-full px-0'>
      <div className='mb-8 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            My Addresses
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Manage your shipping addresses for faster checkout
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className='w-full sm:w-auto'>
          <Icon name='PLUS' className='mr-2 h-4 w-4' />
          Add New Address
        </Button>
      </div>

      {/* Add/Edit Address Form */}
      {(showAddForm || isEditing) && (
        <Card className='mb-8 overflow-hidden'>
          <CardHeader className='bg-gray-50 px-6 py-4 dark:bg-gray-800/50'>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {isEditing
                ? 'Update your address details below.'
                : 'Add a new shipping address for your orders.'}
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-8 px-6 py-4'>
              {/* 1. Address Type Section */}
              <div className='space-y-4'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Address Type
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Select the type of address you're adding
                  </p>
                </div>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {ADDRESS_TYPES.map((type) => (
                    <div key={type.value} className='relative'>
                      <input
                        type='radio'
                        id={`type-${type.value}`}
                        name='type'
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className='peer hidden'
                      />
                      <label
                        htmlFor={`type-${type.value}`}
                        className={`flex cursor-pointer items-center justify-center rounded-md border p-3 text-center text-sm font-medium transition-colors ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600/50'
                        }`}>
                        <Icon name={type.icon} className='mr-2 h-4 w-4' />
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.type === 'other' && (
                  <div className='mt-4'>
                    <Label htmlFor='description'>Description</Label>
                    <Input
                      id='description'
                      name='description'
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="e.g., Parent's house, Office, etc."
                      className='mt-1'
                    />
                  </div>
                )}
              </div>

              {/* 1. Location Information Section */}
              <div className='space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Location Information
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Help us locate your address
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  {/* Left Column */}
                  <div className='space-y-6'>
                    {/* Country */}
                    <div>
                      <Label htmlFor='country'>
                        Country <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => {
                          handleChange({ target: { name: 'country', value } });
                        }}>
                        <SelectTrigger
                          className={`mt-1 ${
                            errors.country
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}>
                          <SelectValue placeholder='Select a country' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {eastAfricanCountries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.name}>
                                <div className='flex items-center'>
                                  <span className='mr-2'>{country.flag}</span>
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className='mt-1 text-xs text-gray-500'>
                        Select your country from the list
                      </p>
                      {errors.country && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.country}
                        </p>
                      )}
                    </div>
                    {/* City/Area */}
                    <div>
                      <Label htmlFor='city'>
                        City/Area <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='city'
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.city
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., Kilimani, Westlands, Kileleshwa'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        Enter your city, town, or neighborhood
                      </p>
                      {errors.city && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className='space-y-6'>
                    {/* State/Province */}
                    <div>
                      <Label htmlFor='state'>
                        State/Province <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='state'
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.state
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., Nairobi, Mombasa, Coast'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        Enter your state, province, or county
                      </p>
                      {errors.state && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.state}
                        </p>
                      )}
                    </div>
                    {/* Postal Code */}
                    <div>
                      <Label htmlFor='postalCode'>Postal Code (Optional)</Label>
                      <Input
                        id='postalCode'
                        name='postalCode'
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.postalCode
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., 00100'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        Enter 5-digit postal code (e.g., 00100 for GPO Nairobi)
                      </p>
                      {errors.postalCode && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Address Details Section */}
              <div className='space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Address Details
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Where should we deliver to?
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  {/* Left Column */}
                  <div className='space-y-6'>
                    {/* Street Address */}
                    <div>
                      <Label htmlFor='address1'>
                        Street Address <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='address1'
                        name='address1'
                        value={formData.address1}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.address1
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., 123 Main Street'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        House number and street name
                      </p>
                      {errors.address1 && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.address1}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className='space-y-6'>
                    {/* Apartment, suite, etc. */}
                    <div>
                      <Label htmlFor='address2'>
                        Apartment, suite, etc. (Optional)
                      </Label>
                      <Input
                        id='address2'
                        name='address2'
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder='e.g., Apartment 4B, Floor 3'
                        className='mt-1'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        Apartment, suite, unit, building, floor, etc.
                      </p>
                    </div>
                  </div>
                  {/* Full Width - Additional Information */}
                  <div className='col-span-full'>
                    <Label htmlFor='additionalInfo'>
                      Additional Information
                    </Label>
                    <Textarea
                      id='additionalInfo'
                      name='additionalInfo'
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder='Any additional delivery instructions, landmarks, or notes for the delivery person'
                      rows={3}
                      className='mt-1'
                    />
                    <p className='mt-1 text-xs text-gray-500'>
                      e.g., "Building is behind the mall", "Call on arrival",
                      etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Contact Information Section */}
              <div className='space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Contact Information
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Who should we deliver to?
                  </p>
                </div>
                <div className='space-y-6'>
                  {/* First Row */}
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    {/* First Name */}
                    <div>
                      <Label htmlFor='firstName'>
                        First Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., John'
                      />
                      {errors.firstName && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <Label htmlFor='lastName'>
                        Last Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`mt-1 ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder='e.g., Doe'
                      />
                      {errors.lastName && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    {/* Phone Number */}
                    <div>
                      <Label htmlFor='phone'>
                        Phone Number <span className='text-red-500'>*</span>
                      </Label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <div className='relative flex-shrink-0'>
                          <Select
                            value={formData.countryCode}
                            onValueChange={(value) => {
                              handleChange({
                                target: { name: 'countryCode', value },
                              });
                            }}>
                            <SelectTrigger className='h-10 w-32 rounded-r-none border-r-0 focus:ring-1 focus:ring-inset focus:ring-blue-500'>
                              <SelectValue placeholder='🇰🇪 +254' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {eastAfricanCountries.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.dialCode.replace('+', '')}>
                                    <div className='flex items-center'>
                                      <span className='mr-2'>
                                        {country.flag}
                                      </span>
                                      <span className='mr-2'>
                                        {country.dialCode}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='relative flex-1'>
                          <Input
                            id='phone'
                            name='phone'
                            type='tel'
                            value={formData.phone}
                            onChange={handleChange}
                            className={`block w-full rounded-l-none ${
                              errors.phone
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : ''
                            }`}
                            placeholder='712 345 678'
                          />
                        </div>
                      </div>
                      <p className='mt-1 text-xs text-gray-500'>
                        Format: 7XX XXX XXX or 07XX XXX XXX
                      </p>
                      {errors.phone && (
                        <p className='mt-1 text-sm text-red-600'>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <Label htmlFor='company'>Company (Optional)</Label>
                      <Input
                        id='company'
                        name='company'
                        value={formData.company}
                        onChange={handleChange}
                        placeholder='Your company name'
                        className='mt-1'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        If this is a business address
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Default Address Toggle */}
              <div className='mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div className='flex items-center space-x-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
                  <Checkbox
                    id='isDefault'
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => {
                      handleChange({
                        target: { name: 'isDefault', value: checked },
                      });
                    }}
                  />
                  <Label
                    htmlFor='isDefault'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Set as default shipping address
                  </Label>
                </div>
              </div>
            </CardContent>

            <CardFooter className='flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50'>
              <Button
                type='button'
                variant='outline'
                onClick={resetForm}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon
                      name='LOADER_2'
                      className='mr-2 h-4 w-4 animate-spin'
                    />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Update Address'
                ) : (
                  'Save Address'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Address List */}
      <div className='space-y-6'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <LoadingSpinner />
          </div>
        ) : addresses.length === 0 ? (
          <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
              <MapPin className='h-6 w-6 text-gray-400' />
            </div>
            <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
              No addresses saved
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
              Get started by adding a new address.
            </p>
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {addresses.map((address) => (
              <div key={address._id} className='relative'>
                {renderAddressCard(address)}
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsDeleteDialogOpen(false);
            setAddressToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title='Delete Address'
        description='Are you sure you want to delete this address? This action cannot be undone.'
        confirmText='Confirm'
        variant='danger'
      />
    </div>
  );
};

export default Addresses;
