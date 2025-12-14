import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import Logo from '../common/Logo';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', path: ROUTES.SHOP },
        { name: 'New Arrivals', path: `${ROUTES.SHOP}?filter=new` },
        { name: 'On Sale', path: `${ROUTES.SHOP}?filter=sale` },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', path: ROUTES.CONTACT },
        { name: 'FAQs', path: ROUTES.FAQ },
        { name: 'Delivery & Returns', path: ROUTES.DELIVERY_RETURNS },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: ROUTES.PRIVACY_POLICY },
        { name: 'Terms of Service', path: ROUTES.TERMS },
        { name: 'About Us', path: ROUTES.ABOUT },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', name: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com', name: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com', name: 'Instagram' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with:', email);
    setEmail('');
  };

  return (
    <footer className='bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Brand Info */}
          <div className='lg:col-span-1'>
            <div className='mb-4'>
              <Logo size='lg' withBadge={true} />
            </div>
            <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>
              Your trusted online marketplace for quality products in East
              Africa.
            </p>

            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                Subscribe to our newsletter
              </h4>
              <form onSubmit={handleSubscribe} className='flex'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Your email'
                  className='flex-1 px-4 py-2 text-sm text-gray-900 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                  required
                />
                <button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'>
                  <Send className='h-4 w-4' />
                </button>
              </form>
            </div>

            <div className='flex space-x-4'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors'
                  aria-label={social.name}>
                  <social.icon className='h-5 w-5' />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h4 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
                {column.title}
              </h4>
              <ul className='space-y-3'>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className='text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors'>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info - 5th Column */}
          <div>
            <h4 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
              Get in Touch
            </h4>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <MapPin className='h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0' />
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  5th Floor, West Towers
                  <br />
                  Chiromo Lane, Westlands
                  <br />
                  Nairobi, Kenya
                </span>
              </li>
              <li className='flex items-center'>
                <Mail className='h-5 w-5 text-gray-400 mr-3 flex-shrink-0' />
                <a
                  href='mailto:info@markethub.co.ke'
                  className='text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors'>
                  info@markethub.co.ke
                </a>
              </li>
              <li className='flex items-center'>
                <Phone className='h-5 w-5 text-gray-400 mr-3 flex-shrink-0' />
                <a
                  href='tel:+254717587337'
                  className='text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors'>
                  +254 717 587 337
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-100 dark:border-gray-800 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-sm text-gray-500 dark:text-gray-400 text-center md:text-left'>
              <p>&copy; {currentYear} MarketHub. All rights reserved.</p>
            </div>
            <div className='mt-3 md:mt-0'>
              <div className='flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400'>
                <span>Developed by</span>
                <a
                  href='https://techdave.netlify.app/'
                  target='_blank'
                  rel='noopener noreferrer nofollow'
                  className='font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center'>
                  David
                  <svg
                    className='w-3.5 h-3.5 ml-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
