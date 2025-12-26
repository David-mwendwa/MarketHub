import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
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

// Import specific icons we need from Lucide
const { Home, Briefcase, MapPin, HelpCircle } = LucideIcons;

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

// Get Kenyan cities/counties from regionsByCountry
const KENYAN_CITIES = regionsByCountry.KE.map((region) => region.label);

// Mock data with Kenyan addresses
const initialAddresses = [
  {
    id: 1,
    fullName: 'Kamau Wanjiru',
    building: 'Uchumi House',
    street: 'Moi Avenue',
    estate: 'CBD',
    city: 'Nairobi',
    zipCode: '00100',
    country: 'Kenya',
    countryCode: '254',
    phone: '712345678',
    isDefault: true,
    type: 'home',
  },
  {
    id: 2,
    fullName: 'Amina Omondi',
    building: 'Westgate Mall',
    street: 'Mwanzi Road',
    estate: 'Westlands',
    city: 'Nairobi',
    zipCode: '00100',
    country: 'Kenya',
    countryCode: '254',
    phone: '711223344',
    isDefault: false,
    type: 'work',
    description: 'Office address',
  },
  {
    id: 3,
    fullName: 'James Otieno',
    building: 'Tuskys Mall',
    street: 'Kisumu-Busia Road',
    estate: 'Milimani',
    city: 'Kisumu',
    zipCode: '40100',
    country: 'Kenya',
    countryCode: '254',
    phone: '722334455',
    isDefault: false,
    type: 'home',
    description: "Parents' house",
  },
];

const Addresses = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isEditing, setIsEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home', // 'home', 'work', or 'other'
    description: '',
    fullName: '',
    countryCode: '254', // Default to Kenya
    phone: '',
    street: '',
    apartment: '',
    building: '',
    estate: '',
    city: '',
    country: 'Kenya', // Default to Kenya
    zipCode: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

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
      'fullName',
      'street',
      'city',
      'zipCode',
      'country',
      'phone',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Phone number validation (simple check for digits and length)
    if (
      formData.phone &&
      !/^\d{10,15}$/.test(formData.phone.replace(/[^\d]/g, ''))
    ) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Postal code validation (Kenyan format - 5 digits)
    if (formData.zipCode && !/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const saveAddress = (address) => {
        if (address.id) {
          // Update existing address
          const { state: _, ...addressWithoutState } = address;
          return addresses.map((a) =>
            a.id === address.id ? { ...a, ...addressWithoutState } : a
          );
        } else {
          // Add new address
          const { state: _, ...addressWithoutState } = address;
          return [
            ...addresses,
            {
              ...addressWithoutState,
              id: `addr-${Date.now()}`,
            },
          ];
        }
      };

      if (isEditing) {
        // Update existing address
        setAddresses(saveAddress(formData));
        toast.success('Address updated successfully');
      } else {
        // Add new address
        setAddresses(saveAddress(formData));
        toast.success('Address added successfully');
      }

      // Reset form
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
      id: null,
      fullName: '',
      street: '',
      apartment: '',
      building: '',
      estate: '',
      city: '',
      zipCode: '',
      country: 'Kenya',
      countryCode: '254',
      phone: '',
      isDefault: false,
      type: 'home',
      description: '',
    });
    setIsEditing(null);
    setShowAddForm(false);
    setErrors({});
  };

  // Edit an address
  const handleEdit = (address) => {
    setFormData({
      id: address.id,
      fullName: address.fullName,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault || false,
      type: address.type || 'home',
      description: address.description || '',
    });
    setIsEditing(address.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete an address
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    }
  };

  // Set as default address
  const setAsDefault = async (id) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error updating default address:', error);
      toast.error('Failed to update default address');
    }
  };

  // Format phone number for display based on country code
  const formatPhoneNumber = (phone, countryCode = '254') => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Get country info for formatting
    const country = eastAfricanCountries.find(
      (c) => c.dialCode === `+${countryCode}`
    ) || { dialCode: countryCode };

    // Format based on country code
    switch (country.dialCode) {
      case '+254': // Kenya
        if (cleaned.length === 9) {
          // Format as 7XX XXX XXX
          const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
          return match
            ? `${country.dialCode} ${match[1]} ${match[2]} ${match[3]}`
            : `${country.dialCode} ${phone}`;
        } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
          // Format as 07XX XXX XXX
          const match = cleaned.match(/^(0\d{2})(\d{3})(\d{3})$/);
          return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
        }
        break;

      case '+255': // Tanzania
      case '+256': // Uganda
      case '+250': // Rwanda
      case '+257': // Burundi
      case '+211': // South Sudan
      default:
        // Default formatting for other countries
        if (cleaned.length >= 7) {
          // Simple formatting for other East African countries
          return `${country.dialCode} ${cleaned}`;
        }
    }

    return `${country.dialCode} ${phone}`;
  };

  // Render address card
  const renderAddressCard = (address) => {
    const addressType =
      ADDRESS_TYPES.find((type) => type.value === address.type) ||
      ADDRESS_TYPES[0];
    const IconComponent = addressType.icon || HelpCircle;

    return (
      <Card
        key={address.id}
        className='relative overflow-hidden transition-all hover:shadow-md dark:border-gray-700'>
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
                {address.fullName}
              </CardTitle>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {addressType.label}{' '}
                {address.description ? `• ${address.description}` : ''}
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
                {address.building && (
                  <span className='block font-medium'>{address.building}</span>
                )}
                <span className='block'>{address.street}</span>
                {address.estate && (
                  <span className='block'>{address.estate}</span>
                )}
              </span>
            </p>
            <p className='flex items-center'>
              <Icon
                name='MAP_PIN'
                className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 opacity-0'
              />
              <span>
                {address.city}
                {address.zipCode && `, ${address.country}`}
                {address.zipCode && (
                  <span className='block text-gray-500'>{address.zipCode}</span>
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
          </div>
        </CardContent>
        <CardFooter className='flex justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700'>
          <div className='flex space-x-2'>
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
              onClick={() => handleDelete(address.id)}
              className='text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800'>
              <Icon name='TRASH_2' className='mr-1 h-4 w-4' />
              <span className='sr-only sm:not-sr-only sm:ml-1'>Delete</span>
            </Button>
          </div>
          {!address.isDefault && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAsDefault(address.id)}
              className='text-sm'>
              Set as Default
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className='w-full px-0 py-6'>
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

              {/* 1. Location Information */}
              <div className='space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Location Information
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Help us locate your address
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  <div>
                    <Label htmlFor='country'>Country *</Label>
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
                            <SelectItem key={country.code} value={country.name}>
                              <div className='flex items-center'>
                                <span className='mr-2'>{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='city'>City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => {
                        handleChange({ target: { name: 'city', value } });
                      }}
                      disabled={!formData.country}>
                      <SelectTrigger
                        className={`mt-1 ${
                          errors.city
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}>
                        <SelectValue placeholder='Select a city' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {formData.country ? (
                            regionsByCountry[
                              eastAfricanCountries.find(
                                (c) => c.name === formData.country
                              )?.code || 'KE'
                            ]?.map((region) => (
                              <SelectItem
                                key={region.value}
                                value={region.label}>
                                {region.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='no-country-selected' disabled>
                              Select a country first
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className='mt-1 text-sm text-red-600'>{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='zipCode'>Postal Code *</Label>
                    <Input
                      id='zipCode'
                      name='zipCode'
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`mt-1 ${
                        errors.zipCode
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder='e.g., 00100 (GPO Nairobi)'
                    />
                    <p className='mt-1 text-xs text-gray-500'>
                      Enter 5-digit postal code (e.g., 00100 for GPO Nairobi)
                    </p>
                    {errors.zipCode && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.zipCode}
                      </p>
                    )}
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
                <div className='space-y-6'>
                  <div>
                    <Label htmlFor='building'>Building Name/Number *</Label>
                    <Input
                      id='building'
                      name='building'
                      value={formData.building}
                      onChange={handleChange}
                      className={`mt-1 ${
                        errors.building
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder='e.g., Uchumi House, 3rd Floor'
                    />
                    {errors.building && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.building}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='street'>Street/Road Name *</Label>
                    <Input
                      id='street'
                      name='street'
                      value={formData.street}
                      onChange={handleChange}
                      className={`mt-1 ${
                        errors.street
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder='e.g., Moi Avenue, Waiyaki Way'
                    />
                    {errors.street && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='estate'>Estate/Area *</Label>
                    <Input
                      id='estate'
                      name='estate'
                      value={formData.estate}
                      onChange={handleChange}
                      className={`mt-1 ${
                        errors.estate
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder='e.g., Westlands, Kilimani, Runda'
                    />
                    {errors.estate && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.estate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Contact Information Section */}
              <div className='space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <div>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    Contact Information
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Who should we deliver to?
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div>
                    <Label htmlFor='fullName'>Full Name *</Label>
                    <Input
                      id='fullName'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 ${
                        errors.fullName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder='e.g., Amani Njoroge or Fatuma Abdi'
                    />
                    {errors.fullName && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='phone'>Phone Number *</Label>
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
                            <SelectValue placeholder='Code' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {eastAfricanCountries.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.dialCode.replace('+', '')}>
                                  <div className='flex items-center'>
                                    <span className='mr-2'>{country.flag}</span>
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
                          placeholder='700 123456'
                          className={`rounded-l-none pl-3 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </div>
                    <p className='mt-1 text-xs text-gray-500'>
                      {formData.countryCode === '254'
                        ? 'Format: 7XX XXX XXX or 07XX XXX XXX'
                        : 'Enter your phone number'}
                    </p>
                    {errors.phone && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.phone}
                      </p>
                    )}
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
        {addresses.length === 0 && !showAddForm ? (
          <Card className='text-center'>
            <CardContent className='py-16'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30'>
                <Icon
                  name='MAP_PIN'
                  className='h-8 w-8 text-blue-600 dark:text-blue-400'
                />
              </div>
              <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
                No saved addresses
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                You haven't added any addresses yet. Add your first address to
                get started.
              </p>
              <div className='mt-6'>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  size='lg'>
                  <Icon name='PLUS' className='mr-2 h-4 w-4' />
                  Add Your First Address
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {addresses.map(renderAddressCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
