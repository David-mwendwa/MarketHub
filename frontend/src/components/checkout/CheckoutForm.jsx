// src/components/checkout/CheckoutForm.jsx
import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

import MpesaLogo from '../../assets/images/mpesa-logo.svg';
import VisaLogo from '../../assets/images/visa-logo.svg';
import MastercardLogo from '../../assets/images/mastercard-logo.svg';
import PayPalLogo from '../../assets/images/paypal-logo.svg';

const CheckoutForm = ({ onSubmit, isSubmitting, user }) => {
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    apartment: '',
    city: '',
    country: 'Kenya',
    state: '',
    zipCode: '',
    saveInfo: false,
    sameAsShipping: true,
    paymentMethod: 'mpesa',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    mpesaPhone: user?.phone || '',
  });

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
      {/* CONTACT INFO */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Contact Information
        </h3>

        <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
          <Input
            id='firstName'
            name='firstName'
            type='text'
            label='First name'
            autoComplete='given-name'
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <Input
            id='lastName'
            name='lastName'
            type='text'
            label='Last name'
            autoComplete='family-name'
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <div className='sm:col-span-2'>
            <Input
              id='email'
              name='email'
              type='email'
              label='Email'
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='sm:col-span-2'>
            <Input
              id='phone'
              name='phone'
              type='tel'
              label='Phone'
              autoComplete='tel'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Shipping Address
        </h3>

        <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
          <div className='sm:col-span-2'>
            <Input
              id='address'
              name='address'
              type='text'
              label='Address'
              autoComplete='street-address'
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className='sm:col-span-2'>
            <Input
              id='apartment'
              name='apartment'
              type='text'
              label='Apartment, suite, etc. (optional)'
              value={formData.apartment}
              onChange={handleChange}
            />
          </div>

          <Input
            id='city'
            name='city'
            type='text'
            label='City'
            autoComplete='address-level2'
            value={formData.city}
            onChange={handleChange}
            required
          />

          {/* COUNTRY */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Country
            </label>

            <select
              id='country'
              name='country'
              value={formData.country}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'>
              <option>Kenya</option>
              <option>Uganda</option>
              <option>Tanzania</option>
              <option>Rwanda</option>
              <option>Burundi</option>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
            </select>
          </div>

          <Input
            id='state'
            name='state'
            type='text'
            label='State / Province'
            autoComplete='address-level1'
            value={formData.state}
            onChange={handleChange}
            required
          />

          <Input
            id='zipCode'
            name='zipCode'
            type='text'
            label='ZIP / Postal code'
            autoComplete='postal-code'
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mt-6 flex items-center'>
          <input
            id='saveInfo'
            name='saveInfo'
            type='checkbox'
            checked={formData.saveInfo}
            onChange={handleChange}
            className='h-4 w-4 text-primary-600 rounded border-gray-300'
          />
          <label className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
            Save this information for next time
          </label>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
          Payment Method
        </h3>

        <div className='space-y-6'>
          {/* M-PESA */}
          <div className='flex items-start'>
            <input
              id='mpesa'
              name='paymentMethod'
              type='radio'
              value='mpesa'
              checked={formData.paymentMethod === 'mpesa'}
              onChange={handleChange}
              className='mt-1 h-4 w-4'
            />
            <div className='ml-3'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>M-Pesa</span>
                <img src={MpesaLogo} alt='M-PESA' className='h-6' />
              </div>

              {formData.paymentMethod === 'mpesa' && (
                <div className='mt-3 space-y-3'>
                  <Input
                    id='mpesaPhone'
                    name='mpesaPhone'
                    type='tel'
                    label='M-Pesa Phone Number'
                    placeholder='e.g. 0712345678'
                    value={formData.mpesaPhone}
                    onChange={handleChange}
                    required
                  />
                  <p className='text-xs text-gray-500'>
                    You'll receive an M-Pesa payment request on this number
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* OR DIVIDER */}
          <div className='relative flex items-center py-2'>
            <div className='flex-grow border-t'></div>
            <span className='mx-4 text-sm text-gray-400'>or</span>
            <div className='flex-grow border-t'></div>
          </div>

          {/* CARD PAYMENT */}
          <div>
            <div className='flex items-center'>
              <input
                id='credit-card'
                name='paymentMethod'
                type='radio'
                value='credit-card'
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleChange}
                className='h-4 w-4'
              />

              <div className='ml-3 flex items-center gap-2'>
                <span className='text-sm font-medium'>
                  Credit or Debit Card
                </span>
                <div className='flex items-center gap-2'>
                  <img src={VisaLogo} className='h-4' alt='Visa' />
                  <img src={MastercardLogo} className='h-4' alt='Mastercard' />
                </div>
              </div>
            </div>

            {formData.paymentMethod === 'credit-card' && (
              <div className='mt-4 space-y-4'>
                <Input
                  id='cardNumber'
                  name='cardNumber'
                  label='Card Number'
                  placeholder='0000 0000 0000 0000'
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />

                <Input
                  id='cardName'
                  name='cardName'
                  label='Name on card'
                  placeholder='John Smith'
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                />

                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    id='expiryDate'
                    name='expiryDate'
                    label='Expiration (MM/YY)'
                    placeholder='MM/YY'
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    id='cvv'
                    name='cvv'
                    label='CVV'
                    placeholder='123'
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* PAYPAL */}
          <div className='flex items-center'>
            <input
              id='paypal'
              name='paymentMethod'
              type='radio'
              value='paypal'
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleChange}
              className='h-4 w-4'
            />
            <div className='flex items-center gap-2 ml-3'>
              <span className='text-sm font-medium'>PayPal</span>
              <img src={PayPalLogo} alt='PayPal' className='h-4' />
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </Button>

        <p className='mt-4 text-center text-sm text-gray-500'>
          By placing your order, you agree to our{' '}
          <a href='/terms' className='text-primary-600'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' className='text-primary-600'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;

// // src/components/checkout/CheckoutForm.jsx
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Input, Select } from '../ui/Input';
// import { Button } from '../ui/Button';
// import { User, Mail, Phone, MapPin, Home, Truck } from 'lucide-react';

// const CheckoutForm = ({ user, onSubmit, isSubmitting }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       email: user?.email || '',
//       firstName: user?.firstName || '',
//       lastName: user?.lastName || '',
//       address: '',
//       apartment: '',
//       city: '',
//       country: 'United States',
//       state: '',
//       zipCode: '',
//       phone: user?.phone || '',
//       shippingMethod: 'standard',
//     }
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact information</h2>
//           <Input
//             label="Email address"
//             id="email"
//             type="email"
//             {...register('email', {
//               required: 'Email is required',
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: 'Invalid email address'
//               }
//             })}
//             error={errors.email?.message}
//             placeholder="you@example.com"
//             autoComplete="email"
//           />
//         </div>

//         <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//           <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping address</h2>
//           <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
//             <div>
//               <Input
//                 label="First name"
//                 id="firstName"
//                 {...register('firstName', { required: 'First name is required' })}
//                 error={errors.firstName?.message}
//                 autoComplete="given-name"
//               />
//             </div>
//             <div>
//               <Input
//                 label="Last name"
//                 id="lastName"
//                 {...register('lastName', { required: 'Last name is required' })}
//                 error={errors.lastName?.message}
//                 autoComplete="family-name"
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <Input
//                 label="Address"
//                 id="address"
//                 {...register('address', { required: 'Address is required' })}
//                 error={errors.address?.message}
//                 placeholder="123 Main St"
//                 autoComplete="street-address"
//                 startIcon={<Home className="h-5 w-5 text-gray-400" />}
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <Input
//                 label="Apartment, suite, etc. (optional)"
//                 id="apartment"
//                 {...register('apartment')}
//                 placeholder="Apartment or suite"
//               />
//             </div>
//             <div>
//               <Input
//                 label="City"
//                 id="city"
//                 {...register('city', { required: 'City is required' })}
//                 error={errors.city?.message}
//                 autoComplete="address-level2"
//               />
//             </div>
//             <div>
//               <Select
//                 label="Country"
//                 id="country"
//                 options={[
//                   { value: 'United States', label: 'United States' },
//                   { value: 'Canada', label: 'Canada' },
//                   { value: 'Mexico', label: 'Mexico' },
//                   // Add more countries as needed
//                 ]}
//                 {...register('country', { required: 'Country is required' })}
//                 error={errors.country?.message}
//                 autoComplete="country"
//               />
//             </div>
//             <div>
//               <Select
//                 label="State / Province"
//                 id="state"
//                 options={[
//                   { value: 'CA', label: 'California' },
//                   { value: 'NY', label: 'New York' },
//                   { value: 'TX', label: 'Texas' },
//                   // Add more states as needed
//                 ]}
//                 {...register('state', { required: 'State is required' })}
//                 error={errors.state?.message}
//                 autoComplete="address-level1"
//               />
//             </div>
//             <div>
//               <Input
//                 label="ZIP / Postal code"
//                 id="zipCode"
//                 {...register('zipCode', {
//                   required: 'ZIP / Postal code is required',
//                   pattern: {
//                     value: /^[0-9-]+$/,
//                     message: 'Please enter a valid ZIP / Postal code'
//                   }
//                 })}
//                 error={errors.zipCode?.message}
//                 autoComplete="postal-code"
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <Input
//                 label="Phone"
//                 id="phone"
//                 type="tel"
//                 {...register('phone', {
//                   required: 'Phone number is required',
//                   pattern: {
//                     value: /^[0-9+\-() ]+$/,
//                     message: 'Please enter a valid phone number'
//                   }
//                 })}
//                 error={errors.phone?.message}
//                 autoComplete="tel"
//                 startIcon={<Phone className="h-5 w-5 text-gray-400" />}
//               />
//             </div>
//           </div>
//         </div>

//         <ShippingMethod
//           register={register}
//           errors={errors}
//           defaultMethod="standard"
//         />
//       </div>

//       <div className="flex justify-end pt-6">
//         <Button
//           type="submit"
//           isLoading={isSubmitting}
//           disabled={isSubmitting}
//           className="w-full sm:w-auto"
//         >
//           {isSubmitting ? 'Processing...' : 'Continue to payment'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default CheckoutForm;
