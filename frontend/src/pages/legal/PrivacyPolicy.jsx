import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Lock,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Cookie,
  Clock,
  Users,
  Globe,
  ShieldCheck,
  Package,
  Settings,
  ArrowUpRight,
} from 'lucide-react';
import HeroSection from '../../components/common/HeroSection';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <HeroSection
        title='Privacy Policy'
        badgeText='Demo Site'
        badgeColor='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        titleSize='text-3xl md:text-4xl'
        description='This is a demonstration website only. No real personal data is collected or stored. All information shown is for illustrative purposes.'
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

            <div className='space-y-10'>
              <section className='space-y-8'>
                <div className='flex items-center mb-6'>
                  <ShieldCheck className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Our Commitment to Your Privacy
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                    At MarketHub, we understand the importance of your personal
                    information and are committed to protecting it. This Privacy
                    Policy explains our practices regarding the collection, use,
                    disclosure, and protection of your information when you use
                    our platform.
                  </p>

                  <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                    <div className='flex items-start'>
                      <AlertTriangle className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0' />
                      <p className='text-blue-700 dark:text-blue-300 text-sm'>
                        By using our Service, you agree to the collection and
                        use of information in accordance with this policy. If
                        you do not agree with our policies and practices, please
                        do not use our Service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <FileText className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Information We Collect
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Users className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Personal Information
                    </h3>
                    <ul className='space-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Account Details:</strong> Name, email, phone
                          number, username
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Profile Data:</strong> Photo, gender, date of
                          birth
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Contact Info:</strong> Addresses, phone
                          numbers
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Package className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Transaction Data
                    </h3>
                    <ul className='space-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Order history and purchase details</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Payment information (securely processed)</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Billing and shipping addresses</span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Globe className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Technical & Usage Data
                    </h3>
                    <ul className='space-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>IP address and device information</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Browser type and version</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>Pages visited and time spent</span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <MapPin className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Location Information
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mt-2'>
                      With your permission, we may collect and process
                      information about your device's location to provide
                      location-based services.
                    </p>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <Shield className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    How We Use Your Information
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Cookie className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Types of Information
                    </h3>
                    <ul className='space-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Personal Information:</strong> Name, email,
                          phone number, username
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Transaction Data:</strong> Order history and
                          purchase details
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Technical & Usage Data:</strong> IP address
                          and device information
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Settings className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      How We Use Your Information
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4'>
                      We use your information to provide and improve our
                      services, for example, to personalize your experience, to
                      provide customer support, and to improve the overall
                      quality of our services.
                    </p>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <Cookie className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Cookies and Tracking
                  </h2>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Cookie className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Types of Cookies
                    </h3>
                    <ul className='space-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm'>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Essential:</strong> Required for core
                          functionality
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Preference:</strong> Remember your settings
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Analytics:</strong> Understand site usage
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-primary-500 mr-2'>•</span>
                        <span>
                          <strong>Marketing:</strong> Show relevant ads
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <span className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3'>
                        <Settings className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </span>
                      Cookie Management
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4'>
                      You can control and manage cookies through your browser
                      settings. However, disabling certain cookies may affect
                      your experience on our website.
                    </p>
                    <a
                      href='https://www.allaboutcookies.org/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium'>
                      Learn more about cookies
                      <ArrowUpRight className='h-3.5 w-3.5 ml-1' />
                    </a>
                  </div>
                </div>
              </section>

              <section className='space-y-8 pt-8'>
                <div className='flex items-center mb-6'>
                  <Lock className='h-8 w-8 text-primary-500 mr-3' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    Data Security
                  </h2>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                  <div className='prose dark:prose-invert max-w-none text-sm'>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      We take the security of your data seriously. We use
                      industry-standard security measures to protect your data,
                      including encryption and secure servers.
                    </p>

                    <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4'>
                      <div className='flex items-start'>
                        <AlertTriangle className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0' />
                        <p className='text-blue-700 dark:text-blue-300 text-sm'>
                          While we strive to protect your personal information,
                          no method of transmission over the Internet or method
                          of electronic storage is 100% secure. We cannot
                          guarantee absolute security, but we work hard to
                          protect your information and prevent unauthorized
                          access.
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

export default PrivacyPolicy;
