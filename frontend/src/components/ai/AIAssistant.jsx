import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call your backend API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col h-[600px] z-50 overflow-hidden border border-gray-200 dark:border-gray-700'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center space-x-2'>
          <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
            <Bot className='h-5 w-5 text-blue-600 dark:text-blue-300' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              AI Assistant
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className='p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300 transition-colors'
          aria-label='Close chat'>
          <X className='h-5 w-5' />
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className='flex max-w-[85%]'>
              {msg.role === 'assistant' && (
                <div className='flex-shrink-0 mr-2 mt-1'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                    <Bot className='h-4 w-4 text-blue-600 dark:text-blue-300' />
                  </div>
                </div>
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className='flex-shrink-0 ml-2 mt-1'>
                  <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                    <User className='h-4 w-4 text-gray-600 dark:text-gray-300' />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex items-center space-x-1.5 pl-4'>
            <div
              className='h-2 w-2 bg-blue-500 rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}></div>
            <div
              className='h-2 w-2 bg-blue-500 rounded-full animate-bounce'
              style={{ animationDelay: '150ms' }}></div>
            <div
              className='h-2 w-2 bg-blue-500 rounded-full animate-bounce'
              style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className='p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <div className='relative'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your question...'
            className='w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${
              !input.trim() || isLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}>
            <Send className='h-5 w-5' />
          </button>
        </div>
        <p className='mt-2 text-xs text-center text-gray-500 dark:text-gray-400'>
          AI Assistant may produce inaccurate information. Check important info.
        </p>
      </form>
    </div>
  );
};

export default AIAssistant;
