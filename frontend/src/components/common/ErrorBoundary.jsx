import React, { Component } from 'react';
import { AlertTriangle, Home, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      reportSent: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      reportSent: false,
    });
    this.props.onReset?.();
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;

    // Prepare error report
    const errorReport = {
      title: document.title,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      errorInfo: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
    };

    // Log to console for now
    console.log('Error report:', errorReport);
    this.setState({ reportSent: true });

    // Format email
    const subject = encodeURIComponent(`Error Report: ${document.title}`);
    const body = encodeURIComponent(
      `Hello Support Team,\n\n` +
        `An error was encountered by a user in the application. Here are the details to help with debugging:\n\n` +
        `Page Title: ${errorReport.title}\n` +
        `Page URL: ${errorReport.url}\n` +
        `Timestamp: ${new Date(errorReport.timestamp).toLocaleString()}\n\n` +
        `Error Details:\n` +
        `- Type: ${errorReport.error.name || 'Unknown'}\n` +
        `- Message: ${errorReport.error.message || 'No error message available'}\n\n` +
        `Technical Information:\n\n` +
        `User Agent: ${errorReport.userAgent}\n` +
        `Error Stack:\n${errorReport.error.stack || 'No stack trace available'}\n\n` +
        `Component Stack:\n${errorReport.errorInfo || 'No component stack available'}\n\n` +
        `Thank you for your prompt attention to this matter.\n\n` +
        `Best regards,\n` +
        `Error Reporting System`
    );

    window.open(`mailto:davidmw022@gmail.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const {
      fallbackTitle = 'Oops! Something went wrong',
      fallbackMessage = 'We\'re sorry for the inconvenience. Our team is addressing the issue. Please try refreshing the page.',
      resetText = 'Try Again',
      showReset = true,
    } = this.props;

    return (
      <div className='flex flex-col items-center justify-center p-6 text-center min-h-screen bg-white dark:bg-gray-900'>
        <div className='p-4 text-red-500'>
          <AlertTriangle className='h-10 w-10 mx-auto' />
        </div>

        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          {fallbackTitle || 'An error occurred'}
        </h2>

        <p className='text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto'>
          {fallbackMessage}
        </p>

        <div className='flex flex-wrap gap-3 justify-center'>
          <Button
            onClick={() => (window.location.href = '/')}
            variant='outline'
            className='border-gray-300 hover:bg-gray-50 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-300'>
            <Home className='mr-2 h-4 w-4' />
            Back to Homepage
          </Button>

          {showReset && (
            <Button
              variant='outline'
              className='border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-800/50 dark:hover:border-blue-400'
              onClick={this.handleReset}>
              {resetText}
            </Button>
          )}

          <Button
            onClick={this.handleReportError}
            variant='outline'
            disabled={this.state.reportSent}
            className='border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-800/30'>
            <Mail className='mr-2 h-4 w-4' />
            {this.state.reportSent ? 'Issue Reported' : 'Report Issue'}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && this.state.error && (
          <div className='mt-8 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-left max-w-2xl w-full border border-red-100 dark:border-red-900/20'>
            <details className='text-sm'>
              <summary className='text-red-600 dark:text-red-400 cursor-pointer font-medium'>
                Error Details
              </summary>
              <pre className='mt-2 text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto'>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
