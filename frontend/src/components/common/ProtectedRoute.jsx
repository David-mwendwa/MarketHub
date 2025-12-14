import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { useCallback, useMemo } from 'react';

// Memoized loading component to prevent unnecessary re-renders
const LoadingFallback = ({ fallback }) =>
  fallback || (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500' />
    </div>
  );

// Memoized access denied component
const AccessDenied = ({ fallback, onGoBack }) =>
  fallback || (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700'>
        <div className='flex justify-center mb-6'>
          <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-full'>
            <svg
              className='h-12 w-12 text-red-600 dark:text-red-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='1.5'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
              />
            </svg>
          </div>
        </div>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-3'>
          Access Restricted
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-8'>
          You don't have the necessary permissions to view this page. If you
          believe this is an error, please contact support.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={onGoBack}
              className='px-6 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'>
              ← Back to Previous
            </button>
            <button
              onClick={() => (window.location.href = ROUTES.HOME)}
              className='px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

/**
 * ProtectedRoute component for handling authentication and authorization
 * @param {Object} props - Component props
 * @param {Array} [props.allowedRoles=[]] - Array of allowed user roles
 * @param {React.ReactNode} [props.fallback=null] - Fallback component to render when access is denied
 * @param {boolean} [props.requireVerification=true] - Whether to require email verification
 * @param {React.ReactNode} [props.children] - Child elements to render when authorized
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({
  allowedRoles = [],
  fallback = null,
  requireVerification = true,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize the access check to prevent unnecessary recalculations
  const hasRequiredRole = useMemo(() => {
    if (allowedRoles.length === 0) return true;
    return user?.role && allowedRoles.includes(user.role);
  }, [allowedRoles, user?.role]);

  // Handle navigation back
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  // Show loading state while checking auth status
  if (isLoading) {
    return <LoadingFallback fallback={fallback} />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Only redirect if we're not already on the login page to prevent loops
    if (!location.pathname.startsWith(ROUTES.LOGIN)) {
      const redirectTo = `${location.pathname}${location.search}`;
      return (
        <Navigate
          to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`}
          replace
        />
      );
    }
    // If we're already on the login page, just render nothing
    return null;
  }

  // If user is authenticated but email verification is required and not verified
  if (requireVerification && user && !user.emailVerified) {
    // Only redirect if we're not already on the verify email page
    if (location.pathname !== ROUTES.VERIFY_EMAIL) {
      return (
        <Navigate to={ROUTES.VERIFY_EMAIL} state={{ from: location }} replace />
      );
    }
    // If we're already on the verify email page, just render nothing
    return null;
  }

  // If specific roles are required, check if user has the required role
  if (!hasRequiredRole) {
    return <AccessDenied fallback={fallback} onGoBack={handleGoBack} />;
  }

  // If we get here, user is authenticated and authorized
  return children || <Outlet />;
};

export default ProtectedRoute;
