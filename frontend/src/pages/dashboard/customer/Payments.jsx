import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import MpesaLogo from '../../../assets/images/mpesa-logo.svg';
import VisaLogo from '../../../assets/images/visa-logo.svg';
import MastercardLogo from '../../../assets/images/mastercard-logo.svg';
import PayPalLogo from '../../../assets/images/paypal-logo.svg';
import {
  Plus,
  CreditCard,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/UICard';
import { ROUTES } from '../../../constants/routes';
import { useUser } from '../../../contexts/UserContext';

const Payments = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Dummy payment methods
  const dummyPaymentMethods = [
    {
      id: 'pm_1',
      brand: 'mpesa',
      last4: '6789',
      phone: '+254712345678',
      name: 'John Doe',
      expiry: '',
      isDefault: true,
    },
    {
      id: 'pm_2',
      brand: 'visa',
      last4: '4242',
      expiry: '12/25',
      name: 'John Doe',
      isDefault: false,
    },
    {
      id: 'pm_3',
      brand: 'mastercard',
      last4: '5555',
      expiry: '06/24',
      name: 'John Doe',
      isDefault: false,
    },
    {
      id: 'pm_4',
      brand: 'paypal',
      last4: '7890',
      email: 'john.doe@example.com',
      name: 'John Doe',
      expiry: '',
      isDefault: false,
    },
  ];

  // Get user's payment methods from context
  const { user, updateUser } = useUser();
  const [localPaymentMethods, setLocalPaymentMethods] =
    useState(dummyPaymentMethods);
  const paymentMethods =
    user?.paymentMethods?.length > 0
      ? user.paymentMethods
      : localPaymentMethods;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.cardNumber ||
      formData.cardNumber.replace(/\s/g, '').length < 16
    ) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (formData.expiry && !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    if (formData.cvc && formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPaymentMethod = {
        id: `card_${Date.now()}`,
        last4: formData.cardNumber.slice(-4),
        brand: 'visa', // This would be detected from card number in a real app
        expiry: formData.expiry,
        name: formData.name,
        isDefault: formData.isDefault || paymentMethods.length === 0,
      };

      const updatedMethods = editingId
        ? paymentMethods.map((pm) =>
            pm.id === editingId ? { ...newPaymentMethod, id: editingId } : pm
          )
        : [...paymentMethods, newPaymentMethod];

      // Update local state
      setLocalPaymentMethods(updatedMethods);

      // If user is authenticated, update the context
      if (user) {
        await updateUser({ paymentMethods: updatedMethods });
      }

      // Reset form
      setFormData({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: '',
        isDefault: false,
      });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setIsLoading(true);
      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }));

      // Update local state
      setLocalPaymentMethods(updatedMethods);

      // If user is authenticated, update the context
      if (user) {
        await updateUser({ paymentMethods: updatedMethods });
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this payment method?'))
      return;

    try {
      setIsLoading(true);
      const updatedMethods = paymentMethods.filter(
        (method) => method.id !== id
      );

      // Update local state
      setLocalPaymentMethods(updatedMethods);

      // If user is authenticated, update the context
      if (user) {
        await updateUser({ paymentMethods: updatedMethods });
      }
    } catch (error) {
      console.error('Error removing payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (method) => {
    setFormData({
      cardNumber: `•••• •••• •••• ${method.last4}`,
      expiry: method.expiry,
      cvc: '•••',
      name: method.name,
      isDefault: method.isDefault,
    });
    setEditingId(method.id);
    setShowAddForm(true);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold'>My Payment Methods</h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage your saved payment methods for faster checkout.
          </p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant='default'
            size='sm'
            className='sm:ml-auto'>
            <Plus className='h-4 w-4 mr-1.5' />
            Add Payment Method
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    className='block text-sm font-medium mb-1'
                    htmlFor='cardNumber'>
                    Card Number
                  </label>
                  <input
                    type='text'
                    id='cardNumber'
                    name='cardNumber'
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setFormData({ ...formData, cardNumber: formatted });
                    }}
                    placeholder='1234 5678 9012 3456'
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength='19'
                  />
                  {errors.cardNumber && (
                    <p className='text-sm text-red-500'>{errors.cardNumber}</p>
                  )}
                </div>
                <div>
                  <label
                    className='block text-sm font-medium mb-1'
                    htmlFor='name'>
                    Cardholder Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='John Doe'
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className='text-sm text-red-500'>{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    className='block text-sm font-medium mb-1'
                    htmlFor='expiry'>
                    Expiry Date
                  </label>
                  <input
                    type='text'
                    id='expiry'
                    name='expiry'
                    value={formData.expiry}
                    onChange={(e) => {
                      const formatted = formatExpiry(e.target.value);
                      setFormData({ ...formData, expiry: formatted });
                    }}
                    placeholder='MM/YY'
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.expiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength='5'
                  />
                  {errors.expiry && (
                    <p className='text-sm text-red-500'>{errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label
                    className='block text-sm font-medium mb-1'
                    htmlFor='cvc'>
                    CVC
                  </label>
                  <input
                    type='text'
                    id='cvc'
                    name='cvc'
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder='123'
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.cvc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength='4'
                  />
                  {errors.cvc && (
                    <p className='text-sm text-red-500'>{errors.cvc}</p>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='isDefault'
                    name='isDefault'
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <label htmlFor='isDefault' className='text-sm font-medium'>
                    Set as default payment method
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end space-x-2 border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({
                    cardNumber: '',
                    expiry: '',
                    cvc: '',
                    name: '',
                    isDefault: false,
                  });
                  setErrors({});
                }}
                disabled={isLoading}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingId ? 'Update' : 'Add'} Payment Method</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {paymentMethods.length === 0 && !showAddForm ? (
        <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
            <CreditCard className='h-6 w-6 text-gray-400' />
          </div>
          <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
            No payment methods
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
            You haven't added any payment methods yet.
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            variant='default'
            size='sm'
            className='inline-flex items-center'>
            <Plus className='h-3.5 w-3.5 mr-1.5' />
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
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
                    <div className='h-10 w-16 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center p-1 border border-gray-200 dark:border-gray-700'>
                      {method.brand === 'visa' ? (
                        <img src={VisaLogo} alt='Visa' className='h-6' />
                      ) : method.brand === 'mastercard' ? (
                        <img
                          src={MastercardLogo}
                          alt='Mastercard'
                          className='h-6'
                        />
                      ) : method.brand === 'mpesa' ? (
                        <img src={MpesaLogo} alt='M-PESA' className='h-6' />
                      ) : method.brand === 'paypal' ? (
                        <img src={PayPalLogo} alt='PayPal' className='h-6' />
                      ) : (
                        <CreditCard className='h-6 w-6 text-gray-400' />
                      )}
                    </div>
                    <div>
                      <h3 className='font-medium'>
                        {method.brand === 'paypal'
                          ? `PayPal: ${method.email}`
                          : method.brand === 'mpesa'
                            ? `M-PESA: ${method.phone}`
                            : `•••• •••• •••• ${method.last4}`}
                      </h3>
                      {method.expiry && (
                        <p className='text-sm text-gray-500'>
                          Expires {method.expiry}
                        </p>
                      )}
                      <p className='text-sm text-gray-500'>{method.name}</p>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    {!method.isDefault && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleSetDefault(method.id)}
                        disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className='h-4 w-4 animate-spin mr-2' />
                        ) : (
                          <Check className='h-4 w-4 mr-1' />
                        )}
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30'
                      onClick={() => handleDelete(method.id)}
                      disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(method)}
                      disabled={isLoading}>
                      <Edit2 className='h-4 w-4' />
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

// import React, { useState } from 'react';
// import { Button } from '../../../components/ui/Button';
// import MpesaLogo from '../../../assets/images/mpesa-logo.svg';
// import VisaLogo from '../../../assets/images/visa-logo.svg';
// import MastercardLogo from '../../../assets/images/mastercard-logo.svg';
// import PayPalLogo from '../../../assets/images/paypal-logo.svg';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from '../../../components/ui/UICard';
// import { ROUTES } from '../../../constants/routes';
// import { Plus } from 'lucide-react';

// // Mock data
// const initialPaymentMethods = [
//   {
//     id: 1,
//     type: 'mpesa',
//     phone: '+254 700 123456',
//     name: 'John Doe',
//     isDefault: true,
//   },
//   {
//     id: 2,
//     type: 'visa',
//     last4: '4242',
//     expiry: '12/25',
//     name: 'John Doe',
//     isDefault: false,
//   },
//   {
//     id: 3,
//     type: 'mastercard',
//     last4: '5555',
//     expiry: '06/24',
//     name: 'John Doe',
//     isDefault: false,
//   },
//   {
//     id: 4,
//     type: 'paypal',
//     email: 'buyer@default.com',
//     isDefault: false,
//   },
// ];

// const Payments = () => {
//   const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formData, setFormData] = useState({
//     type: 'card',
//     cardNumber: '',
//     expiry: '',
//     cvc: '',
//     name: '',
//     saveCard: true,
//   });
//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
//     if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
//     if (!formData.cvc) newErrors.cvc = 'CVC is required';
//     if (!formData.name) newErrors.name = 'Name on card is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const newPaymentMethod = {
//       id: Date.now(),
//       type: 'card',
//       last4: formData.cardNumber.slice(-4),
//       expiry: formData.expiry,
//       name: formData.name,
//       isDefault: false,
//     };

//     setPaymentMethods((prev) => [newPaymentMethod, ...prev]);
//     setShowAddForm(false);
//     setFormData({
//       type: 'card',
//       cardNumber: '',
//       expiry: '',
//       cvc: '',
//       name: '',
//       saveCard: true,
//     });
//   };

//   const setDefaultPayment = (id) => {
//     setPaymentMethods((prev) =>
//       prev.map((pm) => ({
//         ...pm,
//         isDefault: pm.id === id,
//       }))
//     );
//   };

//   const removePaymentMethod = (id) => {
//     if (
//       window.confirm('Are you sure you want to remove this payment method?')
//     ) {
//       setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
//     }
//   };

//   return (
//     <div className='space-y-6'>
//       <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
//         <div>
//           <h2 className='text-2xl font-bold tracking-tight'>Payment Methods</h2>
//           <p className='text-muted-foreground'>
//             {paymentMethods.length}{' '}
//             {paymentMethods.length === 1 ? 'payment method' : 'payment methods'}{' '}
//             saved
//           </p>
//         </div>
//         <Button onClick={() => setShowAddForm(true)} className='mt-4 md:mt-0'>
//           Add Payment Method
//         </Button>
//       </div>

//       {showAddForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Payment Method</CardTitle>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className='space-y-4'>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <div className='space-y-2'>
//                   <label
//                     htmlFor='cardNumber'
//                     className='block text-sm font-medium'>
//                     Card Number <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='cardNumber'
//                     name='cardNumber'
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder='1234 5678 9012 3456'
//                     className='w-full px-3 py-2 border rounded-md'
//                   />
//                   {errors.cardNumber && (
//                     <p className='text-sm text-red-500'>{errors.cardNumber}</p>
//                   )}
//                 </div>
//                 <div className='space-y-2'>
//                   <label htmlFor='name' className='block text-sm font-medium'>
//                     Name on Card <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='name'
//                     name='name'
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder='John Doe'
//                     className='w-full px-3 py-2 border rounded-md'
//                   />
//                   {errors.name && (
//                     <p className='text-sm text-red-500'>{errors.name}</p>
//                   )}
//                 </div>
//                 <div className='space-y-2'>
//                   <label htmlFor='expiry' className='block text-sm font-medium'>
//                     Expiry Date <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='expiry'
//                     name='expiry'
//                     value={formData.expiry}
//                     onChange={handleInputChange}
//                     placeholder='MM/YY'
//                     className='w-full px-3 py-2 border rounded-md'
//                   />
//                   {errors.expiry && (
//                     <p className='text-sm text-red-500'>{errors.expiry}</p>
//                   )}
//                 </div>
//                 <div className='space-y-2'>
//                   <label htmlFor='cvc' className='block text-sm font-medium'>
//                     CVC <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='cvc'
//                     name='cvc'
//                     value={formData.cvc}
//                     onChange={handleInputChange}
//                     placeholder='123'
//                     className='w-full px-3 py-2 border rounded-md'
//                   />
//                   {errors.cvc && (
//                     <p className='text-sm text-red-500'>{errors.cvc}</p>
//                   )}
//                 </div>
//                 <div className='flex items-center'>
//                   <input
//                     type='checkbox'
//                     id='saveCard'
//                     name='saveCard'
//                     checked={formData.saveCard}
//                     onChange={handleInputChange}
//                     className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
//                   />
//                   <label
//                     htmlFor='saveCard'
//                     className='ml-2 block text-sm text-gray-700'>
//                     Save this card for future payments
//                   </label>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className='flex justify-end space-x-2 border-t pt-4'>
//               <Button
//                 type='button'
//                 variant='outline'
//                 onClick={() => setShowAddForm(false)}>
//                 Cancel
//               </Button>
//               <Button type='submit'>Add Card</Button>
//             </CardFooter>
//           </form>
//         </Card>
//       )}

//       {paymentMethods.length === 0 ? (
//         <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
//           <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               className='h-6 w-6 text-gray-400'
//               fill='none'
//               viewBox='0 0 24 24'
//               stroke='currentColor'>
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 strokeWidth={2}
//                 d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
//               />
//             </svg>
//           </div>
//           <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
//             No payment methods
//           </h3>
//           <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
//             You haven't added any payment methods yet.
//           </p>
//         </div>
//       ) : (
//         <div className='grid gap-4'>
//           {paymentMethods.map((method) => (
//             <Card key={method.id} className='relative'>
//               {method.isDefault && (
//                 <div className='absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md'>
//                   DEFAULT
//                 </div>
//               )}
//               <CardContent className='pt-6'>
//                 <div className='flex items-center justify-between'>
//                   <div className='flex items-center space-x-4'>
//                     <div className='h-10 w-16 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center p-1'>
//                       {method.type === 'visa' ? (
//                         <img
//                           src={VisaLogo}
//                           alt='Visa'
//                           className='h-full w-auto object-contain'
//                         />
//                       ) : method.type === 'mastercard' ? (
//                         <img
//                           src={MastercardLogo}
//                           alt='Mastercard'
//                           className='h-full w-auto object-contain'
//                         />
//                       ) : method.type === 'mpesa' ? (
//                         <img
//                           src={MpesaLogo}
//                           alt='M-PESA'
//                           className='h-full w-auto object-contain'
//                         />
//                       ) : method.type === 'paypal' ? (
//                         <img
//                           src={PayPalLogo}
//                           alt='PayPal'
//                           className='h-full w-auto object-contain'
//                         />
//                       ) : (
//                         <span className='text-blue-400 font-bold'>PP</span>
//                       )}
//                     </div>
//                     <div>
//                       <h3 className='font-medium'>
//                         {method.type === 'paypal'
//                           ? `PayPal (${method.email})`
//                           : method.type === 'mpesa'
//                             ? `M-PESA (${method.phone})`
//                             : `•••• •••• •••• ${method.last4}`}
//                       </h3>
//                       <p className='text-sm text-gray-500'>
//                         {method.type === 'card' && `Expires ${method.expiry}`}
//                         {method.type === 'visa' && `Expires ${method.expiry}`}
//                         {method.type === 'mastercard' &&
//                           `Expires ${method.expiry}`}
//                       </p>
//                     </div>
//                   </div>
//                   <div className='flex space-x-2'>
//                     {!method.isDefault && (
//                       <Button
//                         variant='outline'
//                         size='sm'
//                         onClick={() => setDefaultPayment(method.id)}>
//                         Set as Default
//                       </Button>
//                     )}
//                     <Button
//                       variant='outline'
//                       size='sm'
//                       className='text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30'
//                       onClick={() => removePaymentMethod(method.id)}>
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payments;
