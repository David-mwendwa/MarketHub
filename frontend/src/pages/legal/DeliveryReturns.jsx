import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import HeroSection from '../../components/common/HeroSection';
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Mail,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const DeliveryReturns = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <HeroSection
        title='Fast & Reliable Delivery, Hassle-Free Returns'
        badgeText='Demo Site'
        badgeColor='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        titleSize='text-3xl md:text-4xl'
        description='This is a demonstration website only. No actual deliveries or returns will be processed. All information shown is for illustrative purposes.'
        descriptionClass='text-sm md:text-base'
        background='from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        className='py-4 sm:py-6'
      />

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10'>
          <div className='prose dark:prose-invert max-w-none'>
            <div className='mb-8'>
              <Link
                to='/'
                className='inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Home
              </Link>
            </div>

            <div className='space-y-12'>
              {/* Delivery Information */}
              <section className='space-y-8'>
                <div className='flex items-center mb-6'>
                  <Truck className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Delivery Information
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  {/* Delivery Areas */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Truck className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Delivery Areas & Times
                    </h3>
                    <div className='space-y-4 mt-4'>
                      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                        <h4 className='font-medium text-blue-700 dark:text-blue-300 mb-1'>
                          Nairobi & Major Cities
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          1-2 business days
                        </p>
                      </div>
                      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                        <h4 className='font-medium text-blue-700 dark:text-blue-300 mb-1'>
                          Other Urban Areas
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          2-4 business days
                        </p>
                      </div>
                      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                        <h4 className='font-medium text-blue-700 dark:text-blue-300 mb-1'>
                          Remote Locations
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          3-7 business days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Fees */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <PackageCheck className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Delivery Fees
                    </h3>
                    <div className='space-y-3 mt-4'>
                      <p className='text-gray-600 dark:text-gray-300'>
                        We offer competitive delivery fees across East Africa.
                        Your exact fee will be calculated at checkout based on:
                      </p>
                      <ul className='list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300 text-sm'>
                        <li>Delivery location</li>
                        <li>Package size and weight</li>
                        <li>Delivery speed selected</li>
                      </ul>
                      <div className='mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-400'>
                        <p className='text-amber-700 dark:text-amber-300 text-sm'>
                          <span className='font-medium'>Free Delivery:</span>{' '}
                          Enjoy free standard delivery on all orders over KES
                          5,000.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Processing */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Clock className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Order Processing & Tracking
                    </h3>
                    <div className='grid md:grid-cols-2 gap-6 mt-4'>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-200 mb-2'>
                          Processing Time
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-sm'>
                          Orders are typically processed within 1-2 business
                          days. During peak seasons, processing may take 3-5
                          business days.
                        </p>
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-200 mb-2'>
                          Tracking Your Order
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-sm'>
                          You'll receive a tracking number via email once your
                          order ships. Track your package in real-time through
                          our website or mobile app.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Returns & Exchanges */}
              <section className='space-y-8'>
                <div className='flex items-center mb-6'>
                  <RefreshCw className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Returns & Exchanges
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  {/* Return Policy */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3'>
                        <RefreshCw className='h-4 w-4 text-green-600 dark:text-green-400' />
                      </span>
                      Our Return Policy
                    </h3>
                    <div className='mt-4 space-y-4'>
                      <div className='p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30'>
                        <h4 className='font-medium text-green-700 dark:text-green-300 mb-2'>
                          30-Day Easy Returns
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-sm'>
                          Not satisfied? Return most items within 30 days for a
                          full refund or exchange. Some exclusions apply.
                        </p>
                      </div>

                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                          Conditions for Returns
                        </h4>
                        <ul className='space-y-2 text-sm'>
                          <li className='flex items-start'>
                            <span className='text-green-500 mr-2 mt-0.5'>
                              ✓
                            </span>
                            <span className='text-gray-600 dark:text-gray-300'>
                              Items must be unused and in original condition
                            </span>
                          </li>
                          <li className='flex items-start'>
                            <span className='text-green-500 mr-2 mt-0.5'>
                              ✓
                            </span>
                            <span className='text-gray-600 dark:text-gray-300'>
                              Original packaging and tags must be intact
                            </span>
                          </li>
                          <li className='flex items-start'>
                            <span className='text-green-500 mr-2 mt-0.5'>
                              ✓
                            </span>
                            <span className='text-gray-600 dark:text-gray-300'>
                              Proof of purchase is required
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How to Return */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3'>
                        <PackageCheck className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      </span>
                      How to Return an Item
                    </h3>
                    <div className='mt-4 space-y-4'>
                      <ol className='space-y-4'>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium mr-3 mt-0.5'>
                            1
                          </span>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Initiate Return
                            </h4>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                              Log in to your account or contact our support team
                              at returns@markethub.africa
                            </p>
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium mr-3 mt-0.5'>
                            2
                          </span>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Package Your Item
                            </h4>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                              Securely pack the item with all original packaging
                              and tags
                            </p>
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium mr-3 mt-0.5'>
                            3
                          </span>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Ship It Back
                            </h4>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                              Use the return label provided or ship to our
                              returns center
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Refunds */}
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3'>
                        <ShieldCheck className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                      </span>
                      Refund Information
                    </h3>
                    <div className='grid md:grid-cols-2 gap-6 mt-4'>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-200 mb-2'>
                          Processing Time
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-sm'>
                          Refunds are typically processed within 3-5 business
                          days after we receive and inspect your return.
                        </p>
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-200 mb-2'>
                          Refund Method
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-sm'>
                          Refunds are issued to the original payment method.
                          Please allow additional time for your bank to process
                          the refund.
                        </p>
                      </div>
                    </div>
                    <div className='mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-400'>
                      <p className='text-purple-700 dark:text-purple-300 text-sm'>
                        <span className='font-medium'>Note:</span> Original
                        shipping fees are non-refundable. Return shipping costs
                        are the responsibility of the customer unless the return
                        is due to our error.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Tracking */}
              <section className='space-y-8'>
                <div className='flex items-center mb-6'>
                  <PackageCheck className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Track Your Order
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <div className='grid md:grid-cols-2 gap-8'>
                    <div>
                      <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center'>
                        <span className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3'>
                          <PackageCheck className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </span>
                        Real-Time Order Tracking
                      </h3>
                      <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                        Stay updated on your order's journey with our real-time
                        tracking system. You'll receive email notifications at
                        every important milestone.
                      </p>
                      <div className='space-y-4'>
                        <div className='flex items-start'>
                          <div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3 mt-0.5'>
                            <span className='text-green-600 dark:text-green-400 text-sm'>
                              1
                            </span>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Order Confirmed
                            </h4>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              We've received your order and are preparing it for
                              shipment.
                            </p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3 mt-0.5'>
                            <span className='text-blue-600 dark:text-blue-400 text-sm'>
                              2
                            </span>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Order Shipped
                            </h4>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Your order is on its way! Track your package with
                              the link provided.
                            </p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mr-3 mt-0.5'>
                            <span className='text-purple-600 dark:text-purple-400 text-sm'>
                              3
                            </span>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-200'>
                              Out for Delivery
                            </h4>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Your order is with our delivery partner and will
                              arrive soon.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg'>
                      <h4 className='font-medium text-gray-700 dark:text-gray-200 mb-3'>
                        How to Track Your Order
                      </h4>
                      <ul className='space-y-3'>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2 mt-0.5'>
                            •
                          </span>
                          <span className='text-sm text-gray-600 dark:text-gray-300'>
                            <span className='font-medium'>Email:</span> Check
                            your inbox for shipping confirmation with tracking
                            details
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2 mt-0.5'>
                            •
                          </span>
                          <span className='text-sm text-gray-600 dark:text-gray-300'>
                            <span className='font-medium'>Account:</span> Log in
                            to view all your orders and tracking information
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2 mt-0.5'>
                            •
                          </span>
                          <span className='text-sm text-gray-600 dark:text-gray-300'>
                            <span className='font-medium'>SMS:</span> Get
                            real-time updates via text message (opt-in required)
                          </span>
                        </li>
                      </ul>

                      <div className='mt-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-400'>
                        <p className='text-blue-700 dark:text-blue-300 text-sm'>
                          <span className='font-medium'>Need help?</span> Our
                          customer service team is available 24/7 to assist with
                          any tracking inquiries.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReturns;
