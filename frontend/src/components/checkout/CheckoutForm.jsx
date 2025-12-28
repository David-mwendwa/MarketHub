import React, { useEffect, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import MpesaLogo from '../../assets/images/mpesa-logo.svg';
import VisaLogo from '../../assets/images/visa-logo.svg';
import MastercardLogo from '../../assets/images/mastercard-logo.svg';
import PayPalLogo from '../../assets/images/paypal-logo.svg';

const CheckoutForm = ({ onSubmit, isSubmitting, user, defaultAddress }) => {
  const [formData, setFormData] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('checkoutFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Merge with default values to ensure all fields exist
        return {
          firstName:
            parsedData.firstName ||
            defaultAddress?.firstName ||
            user?.firstName ||
            '',
          lastName:
            parsedData.lastName ||
            defaultAddress?.lastName ||
            user?.lastName ||
            '',
          email: parsedData.email || user?.email || user?.user?.email || '',
          phone: parsedData.phone || defaultAddress?.phone || user?.phone || '',
          address: parsedData.address || defaultAddress?.address1 || '',
          apartment: parsedData.apartment || defaultAddress?.address2 || '',
          city: parsedData.city || defaultAddress?.city || '',
          country: parsedData.country || defaultAddress?.country || 'Kenya',
          state: parsedData.state || defaultAddress?.state || '',
          postalCode: parsedData.postalCode || defaultAddress?.postalCode || '',
          saveInfo: parsedData.saveInfo || false,
          paymentMethod: parsedData.paymentMethod || 'mpesa',
          cardNumber: parsedData.cardNumber || '',
          cardName: parsedData.cardName || '',
          expiryDate: parsedData.expiryDate || '',
          cvv: parsedData.cvv || '',
          mpesaPhone:
            parsedData.mpesaPhone || defaultAddress?.phone || user?.phone || '',
        };
      }
    }
    // Default values if no localStorage data
    return {
      firstName: defaultAddress?.firstName || user?.firstName || '',
      lastName: defaultAddress?.lastName || user?.lastName || '',
      email: user?.email || '',
      phone: defaultAddress?.phone || user?.phone || '',
      address: defaultAddress?.address1 || '',
      apartment: defaultAddress?.address2 || '',
      city: defaultAddress?.city || '',
      country: defaultAddress?.country || 'Kenya',
      state: defaultAddress?.state || '',
      postalCode: defaultAddress?.postalCode || '',
      saveInfo: false,
      paymentMethod: 'mpesa',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      mpesaPhone: defaultAddress?.phone || user?.phone || '',
    };
  });
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Contact Information */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Contact Information
        </h3>
        <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
          <Input
            label='First name'
            id='firstName'
            name='firstName'
            type='text'
            autoComplete='given-name'
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <Input
            label='Last name'
            id='lastName'
            name='lastName'
            type='text'
            autoComplete='family-name'
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <div className='sm:col-span-2'>
            <Input
              label='Email'
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='sm:col-span-2'>
            <Input
              label='Phone'
              id='phone'
              name='phone'
              type='tel'
              autoComplete='tel'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Shipping Address
        </h3>

        <div className='space-y-6'>
          <div>
            <Input
              label='Address'
              id='address'
              name='address'
              type='text'
              autoComplete='street-address'
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Input
              label='Apartment, suite, etc. (optional)'
              id='apartment'
              name='apartment'
              type='text'
              value={formData.apartment}
              onChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
            <Input
              label='City'
              id='city'
              name='city'
              type='text'
              autoComplete='address-level2'
              value={formData.city}
              onChange={handleChange}
              required
            />

            <Input
              label='Country'
              id='country'
              name='country'
              type='text'
              autoComplete='country'
              value={formData.country}
              onChange={handleChange}
              required
            />

            <Input
              label='State / Province'
              id='state'
              name='state'
              type='text'
              autoComplete='address-level1'
              value={formData.state}
              onChange={handleChange}
              required
            />

            <Input
              label='ZIP / Postal code'
              id='postalCode'
              name='postalCode'
              type='text'
              autoComplete='postal-code'
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex items-center'>
            <Checkbox
              id='saveInfo'
              name='saveInfo'
              checked={formData.saveInfo}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, saveInfo: checked }))
              }
              className='h-4 w-4 rounded'
            />
            <label
              htmlFor='saveInfo'
              className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
              Save this information for next time
            </label>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
          Payment Method
        </h3>

        <div className='space-y-4'>
          {/* M-Pesa Option */}
          <div className='relative'>
            <input
              id='mpesa'
              name='paymentMethod'
              type='radio'
              value='mpesa'
              checked={formData.paymentMethod === 'mpesa'}
              onChange={handleChange}
              className='sr-only'
            />
            <label
              htmlFor='mpesa'
              className={`block p-5 rounded-xl border-2 transition-all ${
                formData.paymentMethod === 'mpesa'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}>
              <div className='flex items-start'>
                <div className='flex items-center h-5 mt-0.5'>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      formData.paymentMethod === 'mpesa'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {formData.paymentMethod === 'mpesa' && (
                      <div className='h-2 w-2 rounded-full bg-white' />
                    )}
                  </div>
                </div>

                <div className='ml-4 w-full'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <span className='text-base font-medium text-gray-900 dark:text-white'>
                        M-PESA
                      </span>
                      {/* <img
                        src={MpesaLogo}
                        alt='M-Pesa'
                        className='h-6 w-auto'
                      /> */}
                    </div>
                  </div>
                  {formData.paymentMethod === 'mpesa' && (
                    <div className='mt-4 space-y-4 pl-1'>
                      <div>
                        <Input
                          label='M-Pesa Phone Number'
                          id='mpesaPhone'
                          name='mpesaPhone'
                          type='tel'
                          placeholder='+254 712 345 678'
                          value={formData.mpesaPhone}
                          onChange={handleChange}
                          required
                          className='max-w-md'
                        />
                        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                          You'll receive a payment request on this number
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Divider */}
          <div className='relative flex items-center my-6'>
            <div className='flex-grow border-t border-gray-200 dark:border-gray-700'></div>
            <span className='flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400'>
              or
            </span>
            <div className='flex-grow border-t border-gray-200 dark:border-gray-700'></div>
          </div>

          {/* Card Option */}
          <div className='relative'>
            <input
              id='card'
              name='paymentMethod'
              type='radio'
              value='card'
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
              className='sr-only'
            />
            <label
              htmlFor='card'
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}>
              <div className='flex items-center h-5 mt-1'>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    formData.paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                  {formData.paymentMethod === 'card' && (
                    <div className='h-2 w-2 rounded-full bg-white' />
                  )}
                </div>
              </div>
              <div className='ml-4'>
                <div className='flex items-center'>
                  <span className='block text-sm font-medium text-gray-900 dark:text-white mr-3'>
                    Credit or Debit Card
                  </span>
                  {/* <div className='flex space-x-2'>
                    <img src={VisaLogo} alt='Visa' className='h-5' />
                    <img
                      src={MastercardLogo}
                      alt='Mastercard'
                      className='h-5'
                    />
                  </div> */}
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className='mt-4 space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <Input
                        label='Name on Card'
                        id='cardName'
                        name='cardName'
                        type='text'
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label='Card Number'
                        id='cardNumber'
                        name='cardNumber'
                        type='text'
                        placeholder='1234 5678 9012 3456'
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        label='Expiry Date'
                        id='expiryDate'
                        name='expiryDate'
                        type='text'
                        placeholder='MM/YY'
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label='CVV'
                        id='cvv'
                        name='cvv'
                        type='text'
                        placeholder='123'
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* PayPal Option */}
          <div className='relative'>
            <input
              id='paypal'
              name='paymentMethod'
              type='radio'
              value='paypal'
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleChange}
              className='sr-only'
            />
            <label
              htmlFor='paypal'
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}>
              <div className='flex items-center h-5'>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    formData.paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                  {formData.paymentMethod === 'paypal' && (
                    <div className='h-2 w-2 rounded-full bg-white' />
                  )}
                </div>
              </div>
              <div className='ml-4 flex items-center'>
                {/* <img src={PayPalLogo} alt='PayPal' className='h-6 mr-3' /> */}
                <span className='block text-sm font-medium text-gray-900 dark:text-white'>
                  PayPal
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <Button
            type='submit'
            className='w-full py-3 text-base font-medium'
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
          <p className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            By placing your order, you agree to our{' '}
            <a
              href='/terms'
              className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
