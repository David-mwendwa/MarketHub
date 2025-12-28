import React, { useEffect, useState, useCallback } from 'react';
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
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '@/contexts/PaymentContext';
import { toast } from 'react-hot-toast';
import orderAPI from '@/services/order';

const CheckoutForm = ({
  onSubmit,
  isSubmitting,
  user,
  defaultAddress,
  cartTotal,
  cartItems = [],
  subtotal = 0,
  tax = 0,
  shipping = 0,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    config,
    loading: isPaymentLoading,
    processPayment,
    paymentMethods,
  } = usePayment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const [cardError, setCardError] = useState(null);

  const [showDemoCard, setShowDemoCard] = useState(false);
  const loadDemoCard = useCallback(() => {
    setShowDemoCard((prev) => !prev); // Toggle visibility
    if (elements) {
      elements.getElement(CardElement)?.focus();
    }
  }, [elements]);

  const [formData, setFormData] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('checkoutFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
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
          mpesaPhone:
            parsedData.mpesaPhone || defaultAddress?.phone || user?.phone || '',
        };
      }
    }
    return {
      firstName: defaultAddress?.firstName || user?.firstName || '',
      lastName: defaultAddress?.lastName || user?.lastName || '',
      email: user?.email || user?.user?.email || '',
      phone: defaultAddress?.phone || user?.phone || '',
      address: defaultAddress?.address1 || '',
      apartment: defaultAddress?.address2 || '',
      city: defaultAddress?.city || '',
      country: defaultAddress?.country || 'Kenya',
      state: defaultAddress?.state || '',
      postalCode: defaultAddress?.postalCode || '',
      saveInfo: false,
      paymentMethod: 'mpesa',
      mpesaPhone: defaultAddress?.phone || user?.phone || '',
    };
  });

  useEffect(() => {
    if (stripe) {
      setIsStripeLoading(false);
    }
  }, [stripe]);

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

  const handleCardChange = (event) => {
    setCardError(event.error?.message || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError(null);
    setIsProcessing(true);

    try {
      // Format order items with required fields
      const orderItems = cartItems.map((item) => ({
        product: item._id || item.id, // Use _id if available, fallback to id
        name: item.name || `Product ${item.id}`,
        quantity: item.quantity,
        price: {
          amount: item.price || 0, // Use price as is, don't convert to cents
          currency: 'KES',
        },
      }));

      // Use cartTotal from props which already includes subtotal + tax + shipping

      // Prepare order data
      const orderData = {
        items: orderItems,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        },
        payment: {
          method: formData.paymentMethod,
          status: 'pending',
          amount: {
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: cartTotal,
            currency: 'KES',
          },
        },
        total: {
          amount: cartTotal,
          currency: 'KES',
        },
        status: 'pending',
        notes: formData.notes
          ? [
              {
                content: formData.notes,
                isSystem: false,
                createdAt: new Date(),
              },
            ]
          : [],
        // The following fields will be set by the server:
        // - orderNumber
        // - user (from auth token)
      };

      console.log('Creating order with data:', orderData);
      const response = await orderAPI.createOrder(orderData);
      const order = response.data;
      const orderId = order._id || order.data?._id;

      if (!orderId) {
        throw new Error('Failed to create order: No order ID returned');
      }

      if (!orderId) {
        throw new Error('Failed to create order: No order ID returned');
      }

      // Now process the payment with the order ID
      // Create payment data object without order._id
      const paymentData = {
        amount: Math.round(cartTotal * 100),
        currency: 'KES',
        ...formData,
      };

      // Rest of your switch statement remains the same
      switch (formData.paymentMethod) {
        case 'card': {
          if (!stripe || !elements) {
            throw new Error('Payment system not ready. Please try again.');
          }

          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            throw new Error(
              'Card input not found. Please refresh the page and try again.'
            );
          }

          // Map full country name to ISO code
          const countryCodeMap = {
            kenya: 'KE',
            'united states': 'US',
            'united kingdom': 'GB',
            canada: 'CA',
            // Add more country mappings as needed
          };

          const countryCode =
            countryCodeMap[formData.country.toLowerCase()] || formData.country;

          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                country: countryCode, // Use the 2-letter country code
              },
            },
          });

          if (error) {
            throw new Error(error.message || 'Could not process card details');
          }

          const result = await processPayment('card', {
            orderId, // Use the created order ID
            paymentMethodId: paymentMethod.id,
            amount: cartTotal,
            currency: 'KES',
            country: countryCode,
          });

          if (result.success) {
            await onSubmit(formData);
          }
          break;
        }
        // ... rest of your switch cases ...
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCardError(error.message);
      toast.error(
        error.message || 'Payment processing failed. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case 'mpesa':
        return (
          <div className='mt-4 space-y-4 pl-1'>
            <div>
              <Input
                label='M-Pesa Phone Number'
                id='mpesaPhone'
                name='mpesaPhone'
                type='tel'
                placeholder='254712345678'
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
        );
      case 'card':
        return (
          <div className='mt-4 space-y-4'>
            <div className='border rounded-md p-3'>
              <CardElement
                options={{
                  style: {
                    base: {
                      color: '#32325d',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      fontSmoothing: 'antialiased',
                      fontSize: '16px',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#fa755a',
                      iconColor: '#fa755a',
                    },
                  },
                }}
                onChange={handleCardChange}
              />
              {cardError && (
                <p className='mt-2 text-sm text-red-600'>{cardError}</p>
              )}
            </div>
            {/* Add the demo card button here */}
            <button
              type='button'
              onClick={loadDemoCard}
              className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
              {showDemoCard ? 'Hide Test Card' : 'Show Test Card Details'}
            </button>
            {showDemoCard && (
              <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Test Card Details
                </p>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>Card number:</span>{' '}
                    <span className='font-mono'>4242 4242 4242 4242</span>
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>Expiry:</span>{' '}
                    <span className='font-mono'>12/34</span>
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>CVC:</span>{' '}
                    <span className='font-mono'>123</span>
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>ZIP:</span>{' '}
                    <span className='font-mono'>12345</span> (any 5 digits)
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 'paypal':
        return (
          <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md'>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              You will be redirected to PayPal to complete your payment
            </p>
          </div>
        );
      default:
        return null;
    }
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

            <div>
              <label
                htmlFor='country'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Country
              </label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select country' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Kenya'>Kenya</SelectItem>
                  <SelectItem value='Uganda'>Uganda</SelectItem>
                  <SelectItem value='Tanzania'>Tanzania</SelectItem>
                  <SelectItem value='Rwanda'>Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    </div>
                  </div>
                  {formData.paymentMethod === 'mpesa' && renderPaymentFields()}
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
              disabled={isStripeLoading}
            />
            <label
              htmlFor='card'
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              } ${isStripeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
              <div className='ml-4 w-full'>
                <div className='flex items-center'>
                  <span className='block text-sm font-medium text-gray-900 dark:text-white mr-3'>
                    Credit or Debit Card
                  </span>
                </div>
                {formData.paymentMethod === 'card' && renderPaymentFields()}
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
                <span className='block text-sm font-medium text-gray-900 dark:text-white'>
                  PayPal
                </span>
              </div>
            </label>
            {formData.paymentMethod === 'paypal' && renderPaymentFields()}
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <Button
            type='submit'
            className='w-full py-3 text-base font-medium'
            disabled={isSubmitting || isProcessing || isStripeLoading}>
            {isSubmitting || isProcessing || isStripeLoading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Processing...
              </>
            ) : (
              `Pay KES ${cartTotal?.toFixed(2) || '0.00'}`
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

// import React, { useEffect, useState } from 'react';
// import { Input } from '../ui/Input';
// import { Button } from '../ui/Button';
// import { Loader2 } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/Select';
// import { Checkbox } from '../ui/Checkbox';
// import MpesaLogo from '../../assets/images/mpesa-logo.svg';
// import VisaLogo from '../../assets/images/visa-logo.svg';
// import MastercardLogo from '../../assets/images/mastercard-logo.svg';
// import PayPalLogo from '../../assets/images/paypal-logo.svg';

// const CheckoutForm = ({ onSubmit, isSubmitting, user, defaultAddress }) => {
//   const [formData, setFormData] = React.useState(() => {
//     if (typeof window !== 'undefined') {
//       const savedData = localStorage.getItem('checkoutFormData');
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         // Merge with default values to ensure all fields exist
//         return {
//           firstName:
//             parsedData.firstName ||
//             defaultAddress?.firstName ||
//             user?.firstName ||
//             '',
//           lastName:
//             parsedData.lastName ||
//             defaultAddress?.lastName ||
//             user?.lastName ||
//             '',
//           email: parsedData.email || user?.email || user?.user?.email || '',
//           phone: parsedData.phone || defaultAddress?.phone || user?.phone || '',
//           address: parsedData.address || defaultAddress?.address1 || '',
//           apartment: parsedData.apartment || defaultAddress?.address2 || '',
//           city: parsedData.city || defaultAddress?.city || '',
//           country: parsedData.country || defaultAddress?.country || 'Kenya',
//           state: parsedData.state || defaultAddress?.state || '',
//           postalCode: parsedData.postalCode || defaultAddress?.postalCode || '',
//           saveInfo: parsedData.saveInfo || false,
//           paymentMethod: parsedData.paymentMethod || 'mpesa',
//           cardNumber: parsedData.cardNumber || '',
//           cardName: parsedData.cardName || '',
//           expiryDate: parsedData.expiryDate || '',
//           cvv: parsedData.cvv || '',
//           mpesaPhone:
//             parsedData.mpesaPhone || defaultAddress?.phone || user?.phone || '',
//         };
//       }
//     }
//     // Default values if no localStorage data
//     return {
//       firstName: defaultAddress?.firstName || user?.firstName || '',
//       lastName: defaultAddress?.lastName || user?.lastName || '',
//       email: user?.email || '',
//       phone: defaultAddress?.phone || user?.phone || '',
//       address: defaultAddress?.address1 || '',
//       apartment: defaultAddress?.address2 || '',
//       city: defaultAddress?.city || '',
//       country: defaultAddress?.country || 'Kenya',
//       state: defaultAddress?.state || '',
//       postalCode: defaultAddress?.postalCode || '',
//       saveInfo: false,
//       paymentMethod: 'mpesa',
//       cardNumber: '',
//       cardName: '',
//       expiryDate: '',
//       cvv: '',
//       mpesaPhone: defaultAddress?.phone || user?.phone || '',
//     };
//   });
//   // Save form data to localStorage whenever it changes
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('checkoutFormData', JSON.stringify(formData));
//     }
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className='space-y-6'>
//       {/* Contact Information */}
//       <div>
//         <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
//           Contact Information
//         </h3>
//         <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
//           <Input
//             label='First name'
//             id='firstName'
//             name='firstName'
//             type='text'
//             autoComplete='given-name'
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             label='Last name'
//             id='lastName'
//             name='lastName'
//             type='text'
//             autoComplete='family-name'
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />

//           <div className='sm:col-span-2'>
//             <Input
//               label='Email'
//               id='email'
//               name='email'
//               type='email'
//               autoComplete='email'
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className='sm:col-span-2'>
//             <Input
//               label='Phone'
//               id='phone'
//               name='phone'
//               type='tel'
//               autoComplete='tel'
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
//         <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
//           Shipping Address
//         </h3>

//         <div className='space-y-6'>
//           <div>
//             <Input
//               label='Address'
//               id='address'
//               name='address'
//               type='text'
//               autoComplete='street-address'
//               value={formData.address}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <Input
//               label='Apartment, suite, etc. (optional)'
//               id='apartment'
//               name='apartment'
//               type='text'
//               value={formData.apartment}
//               onChange={handleChange}
//             />
//           </div>

//           <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
//             <Input
//               label='City'
//               id='city'
//               name='city'
//               type='text'
//               autoComplete='address-level2'
//               value={formData.city}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label='Country'
//               id='country'
//               name='country'
//               type='text'
//               autoComplete='country'
//               value={formData.country}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label='State / Province'
//               id='state'
//               name='state'
//               type='text'
//               autoComplete='address-level1'
//               value={formData.state}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label='ZIP / Postal code'
//               id='postalCode'
//               name='postalCode'
//               type='text'
//               autoComplete='postal-code'
//               value={formData.postalCode}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className='flex items-center'>
//             <Checkbox
//               id='saveInfo'
//               name='saveInfo'
//               checked={formData.saveInfo}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({ ...prev, saveInfo: checked }))
//               }
//               className='h-4 w-4 rounded'
//             />
//             <label
//               htmlFor='saveInfo'
//               className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
//               Save this information for next time
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Payment Methods */}
//       <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
//         <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
//           Payment Method
//         </h3>

//         <div className='space-y-4'>
//           {/* M-Pesa Option */}
//           <div className='relative'>
//             <input
//               id='mpesa'
//               name='paymentMethod'
//               type='radio'
//               value='mpesa'
//               checked={formData.paymentMethod === 'mpesa'}
//               onChange={handleChange}
//               className='sr-only'
//             />
//             <label
//               htmlFor='mpesa'
//               className={`block p-5 rounded-xl border-2 transition-all ${
//                 formData.paymentMethod === 'mpesa'
//                   ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
//                   : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
//               }`}>
//               <div className='flex items-start'>
//                 <div className='flex items-center h-5 mt-0.5'>
//                   <div
//                     className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
//                       formData.paymentMethod === 'mpesa'
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300 dark:border-gray-600'
//                     }`}>
//                     {formData.paymentMethod === 'mpesa' && (
//                       <div className='h-2 w-2 rounded-full bg-white' />
//                     )}
//                   </div>
//                 </div>

//                 <div className='ml-4 w-full'>
//                   <div className='flex items-center justify-between'>
//                     <div className='flex items-center space-x-3'>
//                       <span className='text-base font-medium text-gray-900 dark:text-white'>
//                         M-PESA
//                       </span>
//                       {/* <img
//                         src={MpesaLogo}
//                         alt='M-Pesa'
//                         className='h-6 w-auto'
//                       /> */}
//                     </div>
//                   </div>
//                   {formData.paymentMethod === 'mpesa' && (
//                     <div className='mt-4 space-y-4 pl-1'>
//                       <div>
//                         <Input
//                           label='M-Pesa Phone Number'
//                           id='mpesaPhone'
//                           name='mpesaPhone'
//                           type='tel'
//                           placeholder='+254 712 345 678'
//                           value={formData.mpesaPhone}
//                           onChange={handleChange}
//                           required
//                           className='max-w-md'
//                         />
//                         <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
//                           You'll receive a payment request on this number
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </label>
//           </div>

//           {/* Divider */}
//           <div className='relative flex items-center my-6'>
//             <div className='flex-grow border-t border-gray-200 dark:border-gray-700'></div>
//             <span className='flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400'>
//               or
//             </span>
//             <div className='flex-grow border-t border-gray-200 dark:border-gray-700'></div>
//           </div>

//           {/* Card Option */}
//           <div className='relative'>
//             <input
//               id='card'
//               name='paymentMethod'
//               type='radio'
//               value='card'
//               checked={formData.paymentMethod === 'card'}
//               onChange={handleChange}
//               className='sr-only'
//             />
//             <label
//               htmlFor='card'
//               className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
//                 formData.paymentMethod === 'card'
//                   ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
//                   : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
//               }`}>
//               <div className='flex items-center h-5 mt-1'>
//                 <div
//                   className={`h-5 w-5 rounded-full border flex items-center justify-center ${
//                     formData.paymentMethod === 'card'
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300 dark:border-gray-600'
//                   }`}>
//                   {formData.paymentMethod === 'card' && (
//                     <div className='h-2 w-2 rounded-full bg-white' />
//                   )}
//                 </div>
//               </div>
//               <div className='ml-4'>
//                 <div className='flex items-center'>
//                   <span className='block text-sm font-medium text-gray-900 dark:text-white mr-3'>
//                     Credit or Debit Card
//                   </span>
//                   {/* <div className='flex space-x-2'>
//                     <img src={VisaLogo} alt='Visa' className='h-5' />
//                     <img
//                       src={MastercardLogo}
//                       alt='Mastercard'
//                       className='h-5'
//                     />
//                   </div> */}
//                 </div>

//                 {formData.paymentMethod === 'card' && (
//                   <div className='mt-4 space-y-4'>
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                       <Input
//                         label='Name on Card'
//                         id='cardName'
//                         name='cardName'
//                         type='text'
//                         value={formData.cardName}
//                         onChange={handleChange}
//                         required
//                       />
//                       <Input
//                         label='Card Number'
//                         id='cardNumber'
//                         name='cardNumber'
//                         type='text'
//                         placeholder='1234 5678 9012 3456'
//                         value={formData.cardNumber}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className='grid grid-cols-2 gap-4'>
//                       <Input
//                         label='Expiry Date'
//                         id='expiryDate'
//                         name='expiryDate'
//                         type='text'
//                         placeholder='MM/YY'
//                         value={formData.expiryDate}
//                         onChange={handleChange}
//                         required
//                       />
//                       <Input
//                         label='CVV'
//                         id='cvv'
//                         name='cvv'
//                         type='text'
//                         placeholder='123'
//                         value={formData.cvv}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </label>
//           </div>

//           {/* PayPal Option */}
//           <div className='relative'>
//             <input
//               id='paypal'
//               name='paymentMethod'
//               type='radio'
//               value='paypal'
//               checked={formData.paymentMethod === 'paypal'}
//               onChange={handleChange}
//               className='sr-only'
//             />
//             <label
//               htmlFor='paypal'
//               className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
//                 formData.paymentMethod === 'paypal'
//                   ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
//                   : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
//               }`}>
//               <div className='flex items-center h-5'>
//                 <div
//                   className={`h-5 w-5 rounded-full border flex items-center justify-center ${
//                     formData.paymentMethod === 'paypal'
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300 dark:border-gray-600'
//                   }`}>
//                   {formData.paymentMethod === 'paypal' && (
//                     <div className='h-2 w-2 rounded-full bg-white' />
//                   )}
//                 </div>
//               </div>
//               <div className='ml-4 flex items-center'>
//                 {/* <img src={PayPalLogo} alt='PayPal' className='h-6 mr-3' /> */}
//                 <span className='block text-sm font-medium text-gray-900 dark:text-white'>
//                   PayPal
//                 </span>
//               </div>
//             </label>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
//           <Button
//             type='submit'
//             className='w-full py-3 text-base font-medium'
//             disabled={isSubmitting}>
//             {isSubmitting ? (
//               <>
//                 <Loader2 className='mr-2 h-5 w-5 animate-spin' />
//                 Processing...
//               </>
//             ) : (
//               'Place Order'
//             )}
//           </Button>
//           <p className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
//             By placing your order, you agree to our{' '}
//             <a
//               href='/terms'
//               className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>
//               Terms of Service
//             </a>{' '}
//             and{' '}
//             <a
//               href='/privacy'
//               className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>
//               Privacy Policy
//             </a>
//             .
//           </p>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CheckoutForm;
