import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Package,
  Settings,
  AlertCircle,
  MessageSquare,
  BookOpen,
  ChevronRight,
  Search,
  Mail,
  Phone,
  Clock,
  Zap,
  BarChart2,
  CreditCard,
  FileText,
  Database,
  Bell,
  Lock,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/Table';
import { PageHeader } from '@pages/dashboard/shared/PageHeader';
import ContentSkeleton from '@pages/dashboard/shared/ContentSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { Modal, ModalFooter } from '@components/ui/Modal';
import { Label } from '@components/ui/Label';
import { ROUTES } from '@/constants/routes';

const AdminSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: <Users className='h-5 w-5 text-blue-500' />,
      path: ROUTES.DASHBOARD.ADMIN_USERS,
      category: 'users',
    },
    {
      title: 'Product Catalog',
      description: 'Manage all products and inventory',
      icon: <Package className='h-5 w-5 text-green-500' />,
      path: ROUTES.DASHBOARD.ADMIN_PRODUCTS,
      category: 'products',
    },
    {
      title: 'Analytics Dashboard',
      description: 'View platform analytics and reports',
      icon: <BarChart2 className='h-5 w-5 text-purple-500' />,
      path: ROUTES.DASHBOARD.ADMIN_ANALYTICS,
      category: 'analytics',
    },
    {
      title: 'Order Management',
      description: 'View and process customer orders',
      icon: <CreditCard className='h-5 w-5 text-amber-500' />,
      path: ROUTES.DASHBOARD.ADMIN_ORDERS,
      category: 'orders',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences',
      icon: <Settings className='h-5 w-5 text-gray-500' />,
      path: '/dashboard/admin/settings',
      category: 'settings',
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and changes',
      icon: <FileText className='h-5 w-5 text-gray-500' />,
      path: '/dashboard/admin/audit-logs',
      category: 'logs',
    },
  ];

  const helpSections = [
    {
      title: 'Documentation',
      icon: <BookOpen className='h-5 w-5 text-blue-500' />,
      items: [
        {
          text: 'Admin Dashboard Guide',
          icon: <BarChart2 className='h-4 w-4 mr-2 text-blue-400' />,
          url: '/docs/admin-dashboard',
        },
        {
          text: 'User Management',
          icon: <Users className='h-4 w-4 mr-2 text-green-400' />,
          url: '/docs/user-management',
        },
        {
          text: 'Product Catalog',
          icon: <Package className='h-4 w-4 mr-2 text-purple-400' />,
          url: '/docs/product-catalog',
        },
        {
          text: 'Security Best Practices',
          icon: <Lock className='h-4 w-4 mr-2 text-amber-400' />,
          url: '/docs/security',
        },
      ],
    },
    {
      title: 'Common Issues',
      icon: <AlertCircle className='h-5 w-5 text-yellow-500' />,
      items: [
        {
          text: 'Resetting User Passwords',
          icon: <Lock className='h-4 w-4 mr-2 text-yellow-400' />,
          url: '/docs/reset-passwords',
        },
        {
          text: 'Product Sync Issues',
          icon: <Zap className='h-4 w-4 mr-2 text-yellow-400' />,
          url: '/docs/product-sync',
        },
        {
          text: 'Performance Optimization',
          icon: <Zap className='h-4 w-4 mr-2 text-yellow-400' />,
          url: '/docs/performance',
        },
        {
          text: 'Backup & Restore',
          icon: <Database className='h-4 w-4 mr-2 text-yellow-400' />,
          url: '/docs/backup-restore',
        },
      ],
    },
    {
      title: 'Support Channels',
      icon: <MessageSquare className='h-5 w-5 text-green-500' />,
      items: [
        {
          text: 'support@example.com',
          icon: <Mail className='h-4 w-4 mr-2 text-green-400' />,
          type: 'email',
          value: 'mailto:support@example.com',
        },
        {
          text: '+1 (555) 123-4567',
          icon: <Phone className='h-4 w-4 mr-2 text-green-400' />,
          type: 'phone',
          value: 'tel:+15551234567',
        },
        {
          text: '24/7 Emergency Line',
          icon: <AlertCircle className='h-4 w-4 mr-2 text-red-400' />,
          type: 'emergency',
          value: 'tel:+15559876543',
        },
        {
          text: 'Live Chat',
          icon: <MessageSquare className='h-4 w-4 mr-2 text-blue-400' />,
          type: 'chat',
          action: () => window.openChatWidget(),
        },
      ],
    },
  ];

  const filteredQuickLinks = quickLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickLinkClick = (path) => {
    navigate(path);
  };

  const handleSupportAction = (item) => {
    if (item.url) {
      window.open(item.url, '_blank');
    } else if (item.value) {
      window.location.assign(item.value);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <div className='px-4 py-8 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 mb-4'>
            <Shield className='h-8 w-8 text-blue-600 dark:text-blue-400' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-3'>
            Admin Support Center
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8'>
            Get help, access documentation, and find resources to manage the
            platform effectively.
          </p>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              className='block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Search help articles or type a question...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className='mb-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Quick Access
            </h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {filteredQuickLinks.length}{' '}
              {filteredQuickLinks.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {searchQuery && filteredQuickLinks.length === 0 ? (
            <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700'>
              <p className='text-gray-500 dark:text-gray-400'>
                No results found for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className='mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
                Clear search
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredQuickLinks.map((link, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickLinkClick(link.path)}
                  className='group p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200 dark:hover:border-blue-800'>
                  <div className='flex items-start'>
                    <div
                      className='flex-shrink-0 p-2 rounded-lg bg-opacity-20 group-hover:bg-opacity-30 transition-colors duration-200'
                      style={{
                        backgroundColor: `${getComputedStyle(document.documentElement).getPropertyValue('--color-blue-100')}40`,
                      }}>
                      {link.icon}
                    </div>
                    <div className='ml-4 flex-1'>
                      <div className='flex items-center justify-between'>
                        <h3 className='text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                          {link.title}
                        </h3>
                        <ChevronRight className='h-4 w-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform duration-200' />
                      </div>
                      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        {link.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Sections */}
        <div className='mb-12'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
            Resources & Support
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {helpSections.map((section, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200'>
                <div className='p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
                  <div className='flex items-center'>
                    <div
                      className='flex-shrink-0 p-2 rounded-lg bg-opacity-20'
                      style={{
                        backgroundColor: `${
                          section.icon.props.className.includes('text-blue-500')
                            ? 'rgba(59, 130, 246, 0.1)'
                            : section.icon.props.className.includes(
                                  'text-yellow-500'
                                )
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)'
                        }`,
                      }}>
                      {React.cloneElement(section.icon, {
                        className: 'h-5 w-5',
                      })}
                    </div>
                    <h3 className='ml-3 text-base font-medium text-gray-900 dark:text-white'>
                      {section.title}
                    </h3>
                  </div>
                </div>
                <div className='p-5'>
                  <ul className='space-y-3'>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className='group flex items-start hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer'
                        onClick={() => handleSupportAction(item)}>
                        <div className='flex-shrink-0 mt-0.5'>
                          {item.icon || (
                            <svg
                              className='h-4 w-4 text-gray-400 group-hover:text-blue-500'
                              fill='none'
                              viewBox='0 0 20 20'
                              stroke='currentColor'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                              />
                            </svg>
                          )}
                        </div>
                        <span className='ml-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150'>
                          {item.text}
                        </span>
                        {item.type === 'email' || item.type === 'phone' ? (
                          <span className='ml-auto text-xs text-gray-400 group-hover:text-blue-500'>
                            {item.type === 'email' ? 'Email' : 'Call'}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-2xl p-8 md:p-10 overflow-hidden'>
          <div className='relative z-10 max-w-4xl mx-auto'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-800/50 mb-5'>
                <MessageSquare className='h-6 w-6 text-blue-600 dark:text-blue-300' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                Still need help?
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg'>
                Our dedicated support team is available around the clock to
                assist you with any questions or issues.
              </p>

              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <a
                  href='mailto:support@example.com'
                  className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'>
                  <Mail className='mr-2 h-5 w-5' />
                  Email Support
                </a>
                <a
                  href='tel:+15551234567'
                  className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'>
                  <Phone className='mr-2 h-5 w-5 text-blue-500' />
                  Call Support
                </a>
              </div>

              <div className='mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
                <Clock className='h-4 w-4 mr-1.5' />
                <span>24/7 Support • Average response time: 15 minutes</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className='absolute top-0 right-0 -mt-10 -mr-10 opacity-20'>
            <div className='w-40 h-40 rounded-full bg-blue-300 dark:bg-blue-700 mix-blend-multiply filter blur-3xl'></div>
          </div>
          <div className='absolute bottom-0 left-0 -mb-10 -ml-10 opacity-20'>
            <div className='w-40 h-40 rounded-full bg-indigo-300 dark:bg-indigo-700 mix-blend-multiply filter blur-3xl'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
