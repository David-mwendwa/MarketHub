import React, { useState } from 'react';
import AIAssistant from '../../components/ai/AIAssistant';
import { Button } from '../../components/ui/Button';
import HeroSection from '../../components/common/HeroSection';
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  MapPin,
  Phone,
} from 'lucide-react';
import { eastAfricanCountries } from '../../constants/countries';

const Contact = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: eastAfricanCountries[0].dialCode, // Default to first country (Kenya)
    subject: '',
    message: '',
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and spaces
    const formattedValue = value.replace(/[^0-9\s]/g, '');
    // Format with spaces for better readability (e.g., 712 345 678)
    const digits = formattedValue.replace(/\s/g, '');
    let formatted = '';

    if (digits.length > 0) {
      formatted = digits.substring(0, 3);
      if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
      if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const selectCountry = (country) => {
    setFormData((prev) => ({ ...prev, countryCode: country.dialCode }));
    setShowCountryDropdown(false);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove all non-digit characters and the leading 0 if present
    const phoneDigits = formData.phone.replace(/\D/g, '').replace(/^0+/, '');
    const fullPhoneNumber = formData.countryCode + phoneDigits;

    // Validate based on country code
    const phoneValidations = {
      '+254': /^\+254[17]\d{8}$/, // Kenya
      '+255': /^\+255[67]\d{8}$/, // Tanzania
      '+256': /^\+256[0-9]{9}$/, // Uganda
      '+250': /^\+250[0-9]{9}$/, // Rwanda
      '+257': /^\+257[0-9]{8}$/, // Burundi
      '+211': /^\+211[0-9]{9}$/, // South Sudan
    };

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (formData.phone) {
      const validationRegex =
        phoneValidations[formData.countryCode] || /^\+\d{10,15}$/;
      if (!validationRegex.test(fullPhoneNumber)) {
        errors.phone = `Please enter a valid ${eastAfricanCountries.find((c) => c.dialCode === formData.countryCode)?.name || 'East African'} phone number`;
      }
    }
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Form submitted:', formData);
        setSubmitStatus({
          success: true,
          message:
            'Thank you for your message! Our East African support team will get back to you within 24 hours.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ success: false, message: '' });
        }, 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus({
          success: false,
          message:
            'Something went wrong. Please try again or contact us directly at info@markethub.africa',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <HeroSection
        badgeText='Get in Touch with Our Team'
        title="We're Here to"
        highlightText='Help You'
        description='Our East African support team is ready to assist you with any questions or concerns you might have.'
      />

      {/* Contact Content */}
      <section className='py-16 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
            {/* Contact Form */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300'>
              <div className='text-center mb-10'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/10 text-primary-600 dark:text-primary-400 mb-4'>
                  <MessageSquare className='h-7 w-7' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  Send us a message
                </h2>
                <p className='text-gray-500 dark:text-gray-400'>
                  We'll respond within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Success Message */}
                {submitStatus.message && (
                  <div
                    className={`p-4 mb-6 rounded-xl ${submitStatus.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                    {submitStatus.message}
                  </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-1.5'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Your Full Name <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        id='name'
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          formErrors.name
                            ? 'border-red-300'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none pl-12`}
                        placeholder='John Doe'
                      />
                      <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.name && (
                      <p className='text-red-500 text-xs mt-1'>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Email Address <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        id='email'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          formErrors.email
                            ? 'border-red-300'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none pl-12`}
                        placeholder='your@email.com'
                      />
                      <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'>
                          <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                          <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                        </svg>
                      </div>
                    </div>
                    {formErrors.email && (
                      <p className='text-red-500 text-xs mt-1'>
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-1'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Phone Number (Optional)
                    </label>
                    <div className='relative flex rounded-md shadow-sm'>
                      <button
                        type='button'
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                        className='inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500'>
                        {eastAfricanCountries.find(
                          (c) => c.dialCode === formData.countryCode
                        )?.flag || '🌍'}
                      </button>
                      {showCountryDropdown && (
                        <div className='absolute z-10 mt-10 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5'>
                          <div
                            className='py-1'
                            role='menu'
                            aria-orientation='vertical'>
                            {eastAfricanCountries.map((country) => (
                              <button
                                key={country.code}
                                type='button'
                                onClick={() => selectCountry(country)}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  formData.countryCode === country.dialCode
                                    ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}>
                                <span className='mr-2'>{country.flag}</span>
                                <span className='flex-1 text-left'>
                                  {country.name}
                                </span>
                                <span className='text-gray-500'>
                                  {country.dialCode}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className='flex-1 relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <span className='text-gray-500 sm:text-sm'>
                            {formData.countryCode}
                          </span>
                        </div>
                        <input
                          type='tel'
                          id='phone'
                          name='phone'
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder='712 345 678'
                          className={`block w-full pl-14 pr-4 py-2.5 text-sm border ${
                            formErrors.phone
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                          } rounded-r-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors`}
                        />
                      </div>
                    </div>
                    {formErrors.phone ? (
                      <p className='text-red-500 text-xs mt-1'>
                        {formErrors.phone}
                      </p>
                    ) : (
                      <p className='text-xs text-gray-500 mt-1'>
                        Format: +254 7XX XXX XXX or 07XX XXX XXX
                      </p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Subject <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <select
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-sm rounded-xl border ${
                          formErrors.subject
                            ? 'border-red-300'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none appearance-none pl-12`}
                        defaultValue=''>
                        <option value='' disabled>
                          Select a subject
                        </option>
                        <option value='Order Inquiry'>Order Inquiry</option>
                        <option value='Product Questions'>
                          Product Questions
                        </option>
                        <option value='Returns & Exchanges'>
                          Returns & Exchanges
                        </option>
                        <option value='Wholesale Inquiries'>
                          Wholesale Inquiries
                        </option>
                        <option value='Partnerships'>Partnerships</option>
                        <option value='Other'>Other</option>
                      </select>
                      <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          viewBox='0 0 20 20'
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.subject && (
                      <p className='text-red-500 text-xs mt-1'>
                        {formErrors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Your Message <span className='text-red-500'>*</span>
                    </label>
                    <span
                      className={`text-xs ${
                        formData.message.length > 500
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}>
                      {formData.message.length}/500
                    </span>
                  </div>
                  <div className='relative'>
                    <textarea
                      id='message'
                      name='message'
                      rows='5'
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={500}
                      className={`w-full px-4 py-3 text-sm rounded-xl border ${
                        formErrors.message
                          ? 'border-red-300'
                          : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none pl-12 resize-none`}
                      placeholder='Tell us how we can help...'></textarea>
                    <div className='absolute left-4 top-4 text-gray-400'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M18 5v8a2 2 0 01-2 2h-2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                  {formErrors.message && (
                    <p className='text-red-500 text-xs mt-1'>
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3.5 px-6 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-transform ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}>
                  {isSubmitting ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className='ml-2 h-5 w-5' />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information & FAQ */}
            <div className='space-y-8'>
              {/* Contact Information */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-8'>
                  Contact Information
                </h3>

                <div className='space-y-5'>
                  {/* Map Embed */}
                  <div className='rounded-xl overflow-hidden h-64 border border-gray-200 dark:border-gray-700/50'>
                    <iframe
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.810988534273!2d36.80645761533303!3d-1.268985199057712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1630000000000!5m2!1sen!2ske'
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      allowFullScreen=''
                      loading='lazy'
                      title='MarketHub Location in Westlands, Nairobi'
                      className='rounded-xl'></iframe>
                  </div>

                  <a
                    href='https://goo.gl/maps/abc123xyz456'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-start p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border border-gray-100 dark:border-gray-700/50 hover:border-primary-100 dark:hover:border-primary-900/50'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 group-hover:from-primary-100 dark:group-hover:from-primary-900/20 group-hover:to-primary-200 dark:group-hover:to-primary-800/30 transition-all'>
                      <MapPin className='h-5 w-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 dark:text-white text-base mb-1.5'>
                        Our Location
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
                        5th Floor, West Towers
                        <br />
                        Chiromo Lane, Westlands
                        <br />
                        Nairobi, Kenya
                      </p>
                      <p className='text-xs mt-1 text-gray-500 dark:text-gray-400'>
                        View on Google Maps
                      </p>
                    </div>
                    <div className='ml-auto text-gray-300 group-hover:text-primary-400 transition-colors'>
                      <ArrowRight className='h-5 w-5' />
                    </div>
                  </a>

                  <a
                    href='mailto:info@markethub.africa'
                    className='flex items-start p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border border-gray-100 dark:border-gray-700/50 hover:border-primary-100 dark:hover:border-primary-900/50'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:from-blue-100 dark:group-hover:from-blue-900/20 group-hover:to-blue-200 dark:group-hover:to-blue-800/30 transition-all'>
                      <Mail className='h-5 w-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 dark:text-white text-base mb-1.5'>
                        Email Us
                      </h4>
                      <p className='text-sm text-blue-600 dark:text-blue-400'>
                        info@markethub.africa
                      </p>
                    </div>
                    <div className='ml-auto text-gray-300 group-hover:text-blue-400 transition-colors'>
                      <ArrowRight className='h-5 w-5' />
                    </div>
                  </a>

                  <a
                    href='tel:+254717587337'
                    className='flex items-start p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border border-gray-100 dark:border-gray-700/50 hover:border-green-100 dark:hover:border-green-900/50'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 group-hover:from-green-100 dark:group-hover:from-green-900/20 group-hover:to-green-200 dark:group-hover:to-green-800/30 transition-all'>
                      <Phone className='h-5 w-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 dark:text-white text-base mb-1.5'>
                        Call Us
                      </h4>
                      <p className='text-sm text-green-600 dark:text-green-400'>
                        +254 717 587337
                      </p>
                    </div>
                    <div className='ml-auto text-gray-300 group-hover:text-green-400 transition-colors'>
                      <ArrowRight className='h-5 w-5' />
                    </div>
                  </a>

                  <div className='flex items-start p-5 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4'>
                      <Clock className='h-5 w-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 dark:text-white text-base mb-2'>
                        Working Hours
                      </h4>
                      <div className='space-y-1'>
                        <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                          <span className='w-28 inline-block'>
                            Monday - Friday:
                          </span>
                          <span className='text-gray-900 dark:text-gray-200 font-medium'>
                            9:00 AM - 6:00 PM
                          </span>
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                          <span className='w-28 inline-block'>Saturday:</span>
                          <span className='text-gray-900 dark:text-gray-200 font-medium'>
                            10:00 AM - 4:00 PM
                          </span>
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                          <span className='w-28 inline-block'>Sunday:</span>
                          <span className='text-gray-900 dark:text-gray-200 font-medium'>
                            Closed
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center'>
          <div className='inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow-sm mb-6'>
            <CheckCircle2 className='h-4 w-4 mr-2 text-green-500' />
            24/7 Customer Support Available
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Need Help? We're Here For You
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            Our dedicated support team is available around the clock to assist
            you with any questions or concerns you may have.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'>
              <Phone className='h-5 w-5 mr-2' />
              Call Now
            </Button>
            <Button
              variant='outline'
              size='lg'
              onClick={() => setShowAIAssistant(true)}
              className='border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-300 transition-all duration-200 shadow-sm dark:shadow-gray-900/20'>
              <MessageSquare className='h-5 w-5 mr-2' />
              <span className='font-medium'>Live Chat</span>
            </Button>
            {showAIAssistant && (
              <AIAssistant onClose={() => setShowAIAssistant(false)} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
