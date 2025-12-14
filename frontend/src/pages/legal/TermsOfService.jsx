import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  FileText,
  User,
  Shield,
  CreditCard,
  RefreshCw,
  Lock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import HeroSection from '../../components/common/HeroSection';

const TermsOfService = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <HeroSection
        title='Terms of Service'
        badgeText='Demo Site'
        badgeColor='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        titleSize='text-3xl md:text-4xl'
        description='This is a demonstration website only. No real transactions will be processed. All information shown is for illustrative purposes.'
        descriptionClass='text-sm md:text-base'
        background='from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        className='py-4 sm:py-6'
      />

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10'>
          <div className='prose dark:prose-invert max-w-none text-sm'>
            <div className='mb-8'>
              <Link
                to='/'
                className='inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Home
              </Link>
            </div>

            <div className='space-y-10'>
              <section className='space-y-8'>
                <div className='flex items-center mb-6'>
                  <FileText className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Introduction
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                    Welcome to MarketHub ("we," "our," or "us"). These Terms of
                    Service ("Terms") govern your access to and use of our
                    website (www.markethub.africa), mobile application, and
                    related services (collectively, the "Service").
                  </p>

                  <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                    <div className='flex items-start'>
                      <AlertTriangle className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0' />
                      <p className='text-blue-700 dark:text-blue-300 text-sm'>
                        By accessing or using our Service, you agree to be bound
                        by these Terms. If you disagree with any part of the
                        terms, you may not access the Service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <User className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Account Registration
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <User className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Account Requirements
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4'>
                      To access certain features of the Service, you must create
                      an account. When you create an account, you agree to:
                    </p>
                    <ul className='space-y-2 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          Provide accurate, current, and complete information
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Maintain the security of your password</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Accept all risks of unauthorized access</span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Shield className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Account Security
                    </h3>
                    <ul className='space-y-2 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Use a strong, unique password</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          Enable two-factor authentication if available
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Report any unauthorized access immediately</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          You're responsible for all account activities
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <Shield className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    User Responsibilities
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3'>
                        Prohibited Activities
                      </h3>
                      <ul className='space-y-2 text-gray-600 dark:text-gray-300 text-sm'>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Violate any laws or regulations</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Infringe on intellectual property rights</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Upload or transmit malicious code</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3'>
                        &nbsp;
                      </h3>
                      <ul className='space-y-2 text-gray-600 dark:text-gray-300 text-sm'>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Engage in fraudulent activities</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Collect personal information of others</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Disrupt service integrity or performance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <CreditCard className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Purchases & Payments
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <CreditCard className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Order Processing
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mt-2'>
                      All purchases through our Service are subject to
                      availability and our acceptance of your order. We reserve
                      the right to refuse or cancel orders at our discretion.
                    </p>
                  </div>

                  <div className='bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl shadow-sm border border-yellow-100 dark:border-yellow-900/30'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3'>
                        <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                      </span>
                      Important Notice
                    </h3>
                    <p className='text-yellow-700 dark:text-yellow-300 mt-2'>
                      Prices are subject to change without notice. We are not
                      responsible for typographical errors regarding price or
                      any other information.
                    </p>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <RefreshCw className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Returns & Refunds
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <RefreshCw className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Return Policy
                    </h3>
                    <div className='space-y-3 mt-2 text-gray-600 dark:text-gray-300 text-sm'>
                      <p className='text-sm'>
                        We accept returns within 14 days of delivery. To be
                        eligible for a return, your item must be:
                      </p>
                      <ul className='space-y-2 pl-4'>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Unused and in original condition</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>In the original packaging</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Accompanied by proof of purchase</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <CreditCard className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Refund Process
                    </h3>
                    <div className='space-y-3 mt-2 text-gray-600 dark:text-gray-300 text-sm'>
                      <p className='text-sm'>
                        Once we receive your item, we will inspect it and notify
                        you of the refund status. Please note:
                      </p>
                      <ul className='space-y-2 pl-4'>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>
                            Refunds are processed within 5-7 business days
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>Original shipping fees are non-refundable</span>
                        </li>
                        <li className='flex items-start'>
                          <span className='text-primary-500 mr-2'>•</span>
                          <span>
                            Sale items may have different return policies
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <Lock className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Intellectual Property
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <div className='space-y-4'>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      The Service and its original content, features, and
                      functionality are owned by MarketHub and are protected by
                      international copyright, trademark, and other intellectual
                      property laws.
                    </p>

                    <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                      <div className='flex items-start'>
                        <AlertCircle className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0' />
                        <p className='text-blue-700 dark:text-blue-300'>
                          Our trademarks and trade dress may not be used in
                          connection with any product or service without the
                          prior written consent of MarketHub.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <AlertTriangle className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Limitation of Liability
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                    In no event shall MarketHub, nor its directors, employees,
                    partners, agents, suppliers, or affiliates, be liable for
                    any indirect, incidental, special, consequential, or
                    punitive damages, including without limitation, loss of
                    profits, data, use, goodwill, or other intangible losses,
                    resulting from:
                  </p>
                  <ul className='list-disc pl-6 text-gray-600 dark:text-gray-300 text-sm space-y-2'>
                    <li>
                      Your access to or use of or inability to access or use the
                      Service
                    </li>
                    <li>
                      Any conduct or content of any third party on the Service
                    </li>
                    <li>Any content obtained from the Service</li>
                    <li>
                      Unauthorized access, use, or alteration of your
                      transmissions or content
                    </li>
                  </ul>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <FileText className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Governing Law
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    These Terms shall be governed and construed in accordance
                    with the laws of Kenya, without regard to its conflict of
                    law provisions.
                  </p>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <AlertCircle className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Changes to Terms
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    We reserve the right to modify or replace these Terms at any
                    time. We will provide at least 30 days' notice before any
                    new terms take effect. By continuing to access or use our
                    Service after those revisions become effective, you agree to
                    be bound by the revised terms.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
