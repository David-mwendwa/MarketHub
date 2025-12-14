import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import HeroSection from '../../components/common/HeroSection';
import AIAssistant from '../../components/ai/AIAssistant';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../components/ui/UICard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/Tabs';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How do I place an order?',
          answer:
            'To place an order, simply browse our products, add items to your cart, and proceed to checkout. Follow these steps:\n\n1. Select your items and click "Add to Cart"\n2. Review your cart and click "Proceed to Checkout"\n3. Enter your shipping information\n4. Choose your preferred payment method\n5. Review and confirm your order',
        },
        {
          question: 'What are your shipping options?',
          answer:
            'We offer several shipping options to meet your needs:\n\n• Standard Shipping: 3-5 business days\n• Express Shipping: 1-2 business days\n• Same-Day Delivery: Available in select areas\n\nShipping costs are calculated at checkout based on your location and order weight.',
        },
        {
          question: 'How can I track my order?',
          answer:
            'You can track your order in several ways:\n\n1. Check your email for shipping confirmation with tracking number\n2. Log into your account and view order history\n3. Contact our support team with your order number\n\nTracking information is usually available within 24-48 hours after your order ships.',
        },
      ],
    },
    {
      category: 'Payments & Pricing',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept various secure payment methods:\n\n• Credit/Debit Cards: Visa, Mastercard\n• Digital Wallets: PayPal\n• Mobile Money: M-Pesa (Kenya)\n• Bank Transfers: Direct bank transfers (processing time: 1-2 business days)',
        },
        {
          question: 'Is it safe to use my credit card?',
          answer:
            'Absolutely. We use industry-standard SSL encryption to protect your payment information. We do not store your full credit card details on our servers. All transactions are processed through secure payment gateways that are PCI DSS compliant.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'Our return policy is designed to be simple and customer-friendly:\n\n• 30-day return window from delivery date\n• Items must be unused, in original packaging with tags attached\n• Some items may be final sale (clearly marked)\n• Return shipping is free for defective or incorrect items\n\nPlease contact our support team to initiate a return.',
        },
        {
          question: 'How long do refunds take?',
          answer:
            'Refund processing times vary by payment method:\n\n• Credit/Debit Cards: 5-10 business days\n• PayPal: 3-5 business days\n• Bank Transfers: 7-14 business days\n\nYou will receive an email confirmation once your refund has been processed.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer:
            'To reset your password:\n\n1. Click "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for a password reset link\n4. Click the link and create a new password\n\nIf you don\'t see the email, please check your spam folder.',
        },
        {
          question: 'How do I update my account information?',
          answer:
            'You can update your account information by:\n\n1. Logging into your account\n2. Clicking on "My Account"\n3. Selecting "Account Settings"\n4. Making the necessary changes\n5. Clicking "Save Changes"\n\nFor security reasons, some changes may require verification.',
        },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: 'success',
        message:
          "Your message has been sent! We'll get back to you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          'There was an error sending your message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full'>
      <HeroSection
        title='Help Center'
        description='Get instant answers to common questions or reach out to our support team for personalized assistance.'
        highlightText=''
        titleSize='text-3xl md:text-4xl'
        descriptionClass='text-sm md:text-base'
        className='w-full py-4 sm:py-6 mb-12'
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='max-w-6xl mx-auto'>
        <TabsList className='grid w-full grid-cols-2 max-w-md mx-auto'>
          <TabsTrigger value='faq' className='text-sm py-2'>
            Help Articles
          </TabsTrigger>
          <TabsTrigger value='contact' className='text-sm py-2'>
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value='faq' className='mt-8'>
          <div className='space-y-8'>
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className='space-y-4'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4'>
                  {category.category}
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                  {category.questions.map((faq, faqIndex) => (
                    <Card
                      key={`${catIndex}-${faqIndex}`}
                      className='overflow-hidden hover:shadow-md transition-shadow'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <p className='text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line'>
                          {faq.answer}
                        </p>
                      </CardContent>
                      <CardFooter className='pt-0'>
                        <button
                          onClick={() => {
                            setActiveTab('contact');
                            setFormData((prev) => ({
                              ...prev,
                              subject: faq.question,
                            }));
                          }}
                          className='text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center'>
                          Still need help?
                          <svg
                            className='ml-1 w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='contact' className='mt-8'>
          <Card className='overflow-hidden'>
            <CardHeader className='bg-gray-50 dark:bg-gray-800/50'>
              <CardTitle className='text-xl'>
                Contact Our Support Team
              </CardTitle>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Our team typically responds within 1 business day. For immediate
                assistance, please call us at
                <a
                  href='tel:+254717587337'
                  className='text-primary-600 hover:underline dark:text-primary-400'>
                  {' '}
                  +254 717 587 337
                </a>{' '}
                (9am-5pm EAT, Monday-Friday).
              </p>
            </CardHeader>

            {submitStatus.message && (
              <div
                className={`mx-6 mb-6 p-4 rounded-md ${
                  submitStatus.type === 'success'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <CardContent className='space-y-4 p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label htmlFor='name' className='text-sm font-medium'>
                      Name <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Your name'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='email' className='text-sm font-medium'>
                      Email <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='your.email@example.com'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label htmlFor='subject' className='text-sm font-medium'>
                    Subject <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder='How can we help you?'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='message' className='text-sm font-medium'>
                    Message <span className='text-red-500'>*</span>
                  </label>
                  <Textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder='Please provide details about your issue or question...'
                    rows={5}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className='flex flex-col sm:flex-row justify-between items-center p-6 pt-0 space-y-4 sm:space-y-0'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  <p>Or reach us directly at:</p>
                  <p className='font-medium text-gray-700 dark:text-gray-200'>
                    support@markethub.africa
                  </p>
                </div>
                <div className='w-full sm:w-auto'>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full sm:w-auto'>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Still need help?
        </h2>
        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6'>
          Check out our{' '}
          <Link
            to={ROUTES.FAQ}
            className='text-blue-600 dark:text-blue-400 hover:underline'>
            FAQ page
          </Link>{' '}
          for more answers, or browse our{' '}
          <Link
            to={ROUTES.TERMS}
            className='text-blue-600 dark:text-blue-400 hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to={ROUTES.PRIVACY_POLICY}
            className='text-blue-600 dark:text-blue-400 hover:underline'>
            Privacy Policy
          </Link>{' '}
          for more information.
        </p>
        <Button>
          <Link to={ROUTES.CONTACT} className='flex items-center'>
            Contact Support
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 ml-2'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Help;
