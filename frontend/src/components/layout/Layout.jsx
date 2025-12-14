import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import AIAssistant from '../ai/AIAssistant';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      <Header />
      <main className='flex-1'>{children}</main>
      {!isDashboardRoute && <Footer />}

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className='fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        aria-label='Chat with AI Assistant'>
        <MessageCircle className='h-6 w-6' />
      </button>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div
            className='fixed inset-0 bg-black/50'
            onClick={() => setShowAIAssistant(false)}></div>
          <div className='fixed bottom-0 right-0 w-full max-w-md h-[80vh] max-h-[80vh] flex flex-col bg-transparent z-50'>
            <AIAssistant onClose={() => setShowAIAssistant(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
