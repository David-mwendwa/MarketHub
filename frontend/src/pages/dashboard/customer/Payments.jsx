import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import MpesaLogo from '../../../assets/images/mpesa-logo.svg';
import VisaLogo from '../../../assets/images/visa-logo.svg';
import MastercardLogo from '../../../assets/images/mastercard-logo.svg';
import PayPalLogo from '../../../assets/images/paypal-logo.svg';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/UICard';
import { ROUTES } from '../../../constants/routes';
import { Plus } from 'lucide-react';

// Mock data
const initialPaymentMethods = [
  {
    id: 1,
    type: 'mpesa',
    phone: '+254 700 123456',
    name: 'John Doe',
    isDefault: true,
  },
  {
    id: 2,
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
    name: 'John Doe',
    isDefault: false,
  },
  {
    id: 3,
    type: 'mastercard',
    last4: '5555',
    expiry: '06/24',
    name: 'John Doe',
    isDefault: false,
  },
  {
    id: 4,
    type: 'paypal',
    email: 'buyer@default.com',
    isDefault: false,
  },
];

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    saveCard: true,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
    if (!formData.cvc) newErrors.cvc = 'CVC is required';
    if (!formData.name) newErrors.name = 'Name on card is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPaymentMethod = {
      id: Date.now(),
      type: 'card',
      last4: formData.cardNumber.slice(-4),
      expiry: formData.expiry,
      name: formData.name,
      isDefault: false,
    };

    setPaymentMethods((prev) => [newPaymentMethod, ...prev]);
    setShowAddForm(false);
    setFormData({
      type: 'card',
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
      saveCard: true,
    });
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const removePaymentMethod = (id) => {
    if (
      window.confirm('Are you sure you want to remove this payment method?')
    ) {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Payment Methods</h2>
          <p className='text-muted-foreground'>
            {paymentMethods.length}{' '}
            {paymentMethods.length === 1 ? 'payment method' : 'payment methods'}{' '}
            saved
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className='mt-4 md:mt-0'>
          Add Payment Method
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='cardNumber'
                    className='block text-sm font-medium'>
                    Card Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='cardNumber'
                    name='cardNumber'
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder='1234 5678 9012 3456'
                    className='w-full px-3 py-2 border rounded-md'
                  />
                  {errors.cardNumber && (
                    <p className='text-sm text-red-500'>{errors.cardNumber}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <label htmlFor='name' className='block text-sm font-medium'>
                    Name on Card <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='John Doe'
                    className='w-full px-3 py-2 border rounded-md'
                  />
                  {errors.name && (
                    <p className='text-sm text-red-500'>{errors.name}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <label htmlFor='expiry' className='block text-sm font-medium'>
                    Expiry Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='expiry'
                    name='expiry'
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder='MM/YY'
                    className='w-full px-3 py-2 border rounded-md'
                  />
                  {errors.expiry && (
                    <p className='text-sm text-red-500'>{errors.expiry}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <label htmlFor='cvc' className='block text-sm font-medium'>
                    CVC <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='cvc'
                    name='cvc'
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder='123'
                    className='w-full px-3 py-2 border rounded-md'
                  />
                  {errors.cvc && (
                    <p className='text-sm text-red-500'>{errors.cvc}</p>
                  )}
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='saveCard'
                    name='saveCard'
                    checked={formData.saveCard}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='saveCard'
                    className='ml-2 block text-sm text-gray-700'>
                    Save this card for future payments
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end space-x-2 border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type='submit'>Add Card</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {paymentMethods.length === 0 ? (
        <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
          </div>
          <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
            No payment methods
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
            You haven't added any payment methods yet.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {paymentMethods.map((method) => (
            <Card key={method.id} className='relative'>
              {method.isDefault && (
                <div className='absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md'>
                  DEFAULT
                </div>
              )}
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='h-10 w-16 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center p-1'>
                      {method.type === 'visa' ? (
                        <img
                          src={VisaLogo}
                          alt='Visa'
                          className='h-full w-auto object-contain'
                        />
                      ) : method.type === 'mastercard' ? (
                        <img
                          src={MastercardLogo}
                          alt='Mastercard'
                          className='h-full w-auto object-contain'
                        />
                      ) : method.type === 'mpesa' ? (
                        <img
                          src={MpesaLogo}
                          alt='M-PESA'
                          className='h-full w-auto object-contain'
                        />
                      ) : method.type === 'paypal' ? (
                        <img
                          src={PayPalLogo}
                          alt='PayPal'
                          className='h-full w-auto object-contain'
                        />
                      ) : (
                        <span className='text-blue-400 font-bold'>PP</span>
                      )}
                    </div>
                    <div>
                      <h3 className='font-medium'>
                        {method.type === 'paypal'
                          ? `PayPal (${method.email})`
                          : method.type === 'mpesa'
                            ? `M-PESA (${method.phone})`
                            : `•••• •••• •••• ${method.last4}`}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {method.type === 'card' && `Expires ${method.expiry}`}
                        {method.type === 'visa' && `Expires ${method.expiry}`}
                        {method.type === 'mastercard' &&
                          `Expires ${method.expiry}`}
                      </p>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    {!method.isDefault && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setDefaultPayment(method.id)}>
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30'
                      onClick={() => removePaymentMethod(method.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
