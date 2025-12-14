import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Truck,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  User,
  Search,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import HeroSection from '../../components/common/HeroSection';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [feedback, setFeedback] = useState({});
  const searchRef = useRef(null);

  // FAQ categories data
  const faqCategories = [
    {
      title: 'General Questions',
      icon: <HelpCircle className='h-5 w-5 text-primary-500 mr-2' />,
      questions: [
        {
          question: 'What is MarketHub?',
          answer:
            'MarketHub is your premier online marketplace offering a wide range of products from trusted sellers across Kenya, Uganda, and Tanzania. We provide a seamless shopping experience with secure payments and reliable delivery.',
        },
        {
          question: 'How do I create an account?',
          answer:
            'Click on the "Sign Up" button in the top right corner, fill in your details (name, email, and password), and verify your email address to complete the registration process.',
        },
        {
          question: 'Is my personal information secure?',
          answer:
            'Yes, we take your privacy seriously. All personal information is encrypted and protected in accordance with our Privacy Policy. We never share your data with third parties without your consent.',
        },
        {
          question: 'How can I contact customer support?',
          answer:
            'You can reach our customer support team via email at support@markethub.africa or call us at +254 717 587 337 during our working hours (Monday - Friday, 9:00 AM - 5:00 PM EAT).',
        },
      ],
    },
    {
      title: 'Delivery & Shipping',
      icon: <Truck className='h-5 w-5 text-primary-500 mr-2' />,
      questions: [
        {
          question: 'What are your delivery areas?',
          answer:
            'We deliver to all major cities and towns in Kenya, Uganda, and Tanzania. Delivery times may vary based on your location.',
        },
        {
          question: 'How long does delivery take?',
          answer:
            'Delivery times vary by location: Nairobi (1-2 business days), other major cities (2-4 business days), and upcountry areas (3-7 business days).',
        },
        {
          question: 'How much does delivery cost?',
          answer:
            'Delivery fees are calculated at checkout based on your location and order size. We offer free delivery on orders over KES 5,000.',
        },
        {
          question: 'Can I track my order?',
          answer:
            "Yes, once your order is shipped, you'll receive a tracking number via email that you can use to monitor your package's progress.",
        },
      ],
    },
    {
      title: 'Payments & Pricing',
      icon: <CreditCard className='h-5 w-5 text-primary-500 mr-2' />,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers. All transactions are secure and encrypted.',
        },
        {
          question: 'Is it safe to use my credit card?',
          answer:
            'Absolutely. We use industry-standard SSL encryption to protect your payment information. Your card details are never stored on our servers.',
        },
        {
          question: 'Do you offer cash on delivery?',
          answer:
            'Yes, we offer cash on delivery for most locations. A small handling fee may apply for this service.',
        },
        {
          question: 'Why was my payment declined?',
          answer:
            'Payments can be declined for various reasons, including insufficient funds, incorrect card details, or security measures. Please check your payment details and try again, or contact your bank for assistance.',
        },
      ],
    },
    {
      title: 'Returns & Refunds',
      icon: <RefreshCw className='h-5 w-5 text-primary-500 mr-2' />,
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We accept returns within 14 days of delivery for most items in their original, unused condition. Some items may be excluded from returns.',
        },
        {
          question: 'How do I return an item?',
          answer:
            'Contact our customer service to initiate a return, package the item securely with all original packaging, and ship it to our returns center. Include the return form or your order number.',
        },
        {
          question: 'How long do refunds take?',
          answer:
            'Refunds are processed within 5-7 business days after we receive and inspect your return. The time it takes for the refund to reflect in your account depends on your payment method.',
        },
        {
          question: 'Who pays for return shipping?',
          answer:
            'The customer is responsible for return shipping costs unless the return is due to our error or a defective product.',
        },
      ],
    },
    {
      title: 'Account & Security',
      icon: <User className='h-5 w-5 text-primary-500 mr-2' />,
      questions: [
        {
          question: 'How do I reset my password?',
          answer:
            'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to create a new password.',
        },
        {
          question: 'Can I change my account information?',
          answer:
            'Yes, you can update your account information, including your name, email, and shipping address, in the "My Account" section after logging in.',
        },
        {
          question: 'How do I delete my account?',
          answer:
            'Please contact our customer support team to request account deletion. Note that this action is permanent and cannot be undone.',
        },
        {
          question: 'How do I unsubscribe from marketing emails?',
          answer:
            'You can unsubscribe by clicking the "Unsubscribe" link at the bottom of any marketing email or by updating your email preferences in your account settings.',
        },
      ],
    },
  ];

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // The search logic is handled in the filteredCategories computed property
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  // Toggle FAQ accordion
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Handle feedback submission
  const handleFeedback = (questionId, isHelpful) => {
    setFeedback((prev) => ({
      ...prev,
      [questionId]: isHelpful ? 'helpful' : 'not-helpful',
    }));
  };

  // Filter categories based on search query and active category
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        activeCategory === 'all' ||
        category.title.toLowerCase() === activeCategory.toLowerCase() ||
        category.questions.length > 0
    );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <HeroSection
        title='Frequently Asked Questions'
        badgeText='Demo Site'
        badgeColor='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        titleSize='text-3xl md:text-4xl'
        description='This is a demonstration website only. The information provided here is for illustrative purposes and does not represent a real business.'
        descriptionClass='text-sm md:text-base'
        background='from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        className='py-4 sm:py-6'
      />

      {/* Search and Filter */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700'>
          <form onSubmit={handleSearch} className='mb-6'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                ref={searchRef}
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                placeholder='Search questions or keywords...'
                aria-label='Search questions'
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={clearSearch}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  aria-label='Clear search'>
                  <X className='h-5 w-5' />
                </button>
              )}
            </div>
          </form>

          <div className='flex flex-wrap gap-2 justify-center'>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}>
              All Categories
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.title}
                onClick={() => setActiveCategory(category.title)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center ${
                  activeCategory === category.title
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}>
                {React.cloneElement(category.icon, {
                  className: 'h-4 w-4 mr-2',
                })}
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <Link
            to='#'
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className='inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to previous page
          </Link>
        </div>

        <div className='space-y-12'>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, categoryIndex) => (
              <motion.section
                key={categoryIndex}
                id={category.title.toLowerCase().replace(/\s+/g, '-')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='space-y-4'>
                <div className='flex items-center mb-6'>
                  <div className='p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                    {React.cloneElement(category.icon, {
                      className: 'h-6 w-6',
                    })}
                  </div>
                  <h2 className='ml-3 text-2xl font-bold text-gray-900 dark:text-white'>
                    {category.title}
                  </h2>
                </div>

                <div className='space-y-4'>
                  {category.questions.map((item, index) => {
                    const itemId = `${category.title.toLowerCase().replace(/\s+/g, '-')}-${index}`;
                    const isOpen = openIndex === itemId;

                    return (
                      <motion.div
                        key={itemId}
                        layout
                        className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200'>
                        <button
                          className='w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors bg-white dark:bg-gray-800'
                          onClick={() => toggleAccordion(itemId)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-${itemId}`}>
                          <span className='text-left font-medium text-gray-900 dark:text-white text-base'>
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className='h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4' />
                          ) : (
                            <ChevronDown className='h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4' />
                          )}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              id={`faq-${itemId}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className='overflow-hidden'>
                              <div className='px-6 pb-6 pt-0'>
                                <div className='prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300'>
                                  <p className='text-sm'>{item.answer}</p>
                                </div>

                                {/* Feedback Section */}
                                <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700'>
                                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                                    Was this helpful?
                                  </p>
                                  <div className='flex items-center space-x-4'>
                                    <button
                                      onClick={() =>
                                        handleFeedback(itemId, true)
                                      }
                                      disabled={feedback[itemId]}
                                      className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                        feedback[itemId] === 'helpful'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                      }`}>
                                      <ThumbsUp className='h-4 w-4 mr-1.5' />
                                      Yes
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleFeedback(itemId, false)
                                      }
                                      disabled={feedback[itemId]}
                                      className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                        feedback[itemId] === 'not-helpful'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                      }`}>
                                      <ThumbsDown className='h-4 w-4 mr-1.5' />
                                      No
                                    </button>
                                    {feedback[itemId] && (
                                      <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                                        Thank you for your feedback!
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Related Questions */}
                                {category.questions.length > 1 && (
                                  <div className='mt-6'>
                                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                                      Related questions:
                                    </p>
                                    <div className='space-y-2'>
                                      {category.questions
                                        .filter(
                                          (q) => q.question !== item.question
                                        )
                                        .slice(0, 2)
                                        .map((related, i) => (
                                          <button
                                            key={i}
                                            onClick={() => {
                                              const relatedId = `${category.title.toLowerCase().replace(/\s+/g, '-')}-${category.questions.findIndex((q) => q.question === related.question)}`;
                                              setOpenIndex(
                                                openIndex === relatedId
                                                  ? null
                                                  : relatedId
                                              );
                                              document
                                                .getElementById(relatedId)
                                                ?.scrollIntoView({
                                                  behavior: 'smooth',
                                                });
                                            }}
                                            className='block w-full text-left text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'>
                                            {related.question}
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            ))
          ) : (
            <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700'>
              <div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 mb-6'>
                <Search className='h-12 w-12 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No results found
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                We couldn't find any questions matching "{searchQuery}". Try
                different keywords or check out our categories.
              </p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='mt-16 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-8 text-center overflow-hidden relative border border-gray-100 dark:border-gray-700'>
          <div className='absolute -right-20 -top-20 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full filter blur-3xl opacity-40'></div>
          <div className='absolute -left-20 -bottom-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-40'></div>

          <div className='relative max-w-2xl mx-auto'>
            <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-gray-700 shadow-md mb-6'>
              <MessageSquare className='h-7 w-7 text-primary-600 dark:text-primary-400' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
              Still have questions?
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
              Our dedicated support team is here to help you with any questions
              or concerns you may have. We're available around the clock to
              ensure you have the best shopping experience.
            </p>

            <div className='grid md:grid-cols-3 gap-6 mt-10'>
              <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow'>
                <div className='inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4'>
                  <Mail className='h-5 w-5' />
                </div>
                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                  Email Us
                </h4>
                <a
                  href='mailto:support@markethub.africa'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm transition-colors'>
                  support@markethub.africa
                </a>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                  Average response time: 2 hours
                </p>
              </div>

              <div className='bg-white dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow'>
                <div className='inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4'>
                  <Phone className='h-5 w-5' />
                </div>
                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                  Call Us
                </h4>
                <a
                  href='tel:+254717587337'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm transition-colors'>
                  +254 717 587 337
                </a>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center'>
                  <Clock className='h-3 w-3 mr-1' />
                  Mon-Fri, 9:00 AM - 5:00 PM EAT
                </p>
              </div>

              <div className='bg-white dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow'>
                <div className='inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4'>
                  <MessageSquare className='h-5 w-5' />
                </div>
                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                  Live Chat
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
                  Chat with our support team in real-time
                </p>
                <button className='text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'>
                  Start Chat →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQs;
