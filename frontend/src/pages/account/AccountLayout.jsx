import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { User, Settings, Lock, ChevronRight } from 'lucide-react';

const AccountLayout = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Profile',
      path: '/account',
      icon: <User className='h-5 w-5' />,
    },
    {
      name: 'Settings',
      path: '/account/settings',
      icon: <Settings className='h-5 w-5' />,
    },
    {
      name: 'Security',
      path: '/account/security',
      icon: <Lock className='h-5 w-5' />,
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Mobile Navigation */}
        <div className='md:hidden mb-6'>
          <select
            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
            value={location.pathname}
            onChange={(e) => (window.location.href = e.target.value)}>
            {navItems.map((item) => (
              <option key={item.path} value={item.path}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar Navigation */}
        <nav className='hidden md:block w-64 flex-shrink-0'>
          <div className='space-y-1'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}>
                <div className='flex items-center'>
                  <span className='mr-3'>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <ChevronRight className='h-4 w-4' />
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
