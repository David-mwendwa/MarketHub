import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
// Shop pages
import {
  Home,
  Shop,
  ProductDetails,
  Categories,
  SearchResults,
} from './pages/shop';

// Auth pages
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
} from './pages/auth';

// Company pages
import { About, Contact, Help } from './pages/company';

// Checkout pages
import { Cart, Checkout } from './pages/checkout';

// Legal pages
import {
  PrivacyPolicy,
  TermsOfService,
  DeliveryReturns,
  FAQs,
} from './pages/legal';

// Error pages
import { NotFound, Unauthorized } from './pages/error';
import { ROUTES } from './constants/routes';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './pages/dashboard/DashboardLayout';

// Dashboard components
import AdminDashboard from './pages/dashboard/admin';
import AdminUsers from './pages/dashboard/admin/Users';
import AdminProducts from './pages/dashboard/admin/Products';
import ProductDetailsPage from './pages/dashboard/admin/components/ProductDetails.jsx';
import SellerProductDetailsPage from './pages/dashboard/seller/components/ProductDetails.jsx';
import AdminOrders from './pages/dashboard/admin/Orders';
import AdminAnalytics from './pages/dashboard/admin/Analytics';
import AdminSupport from './pages/dashboard/admin/Support';
import UserDetails from './pages/dashboard/admin/components/UserDetails.jsx';
import AdminCategories from './pages/dashboard/admin/Categories';
import AddCategory from './pages/dashboard/admin/components/CategoryForm.jsx';
// import EditCategory from './pages/dashboard/admin/EditCategory.ignore.jsx';

import SellerDashboard from './pages/dashboard/seller';
import SellerProducts from './pages/dashboard/seller/Products';
import SellerOrders from './pages/dashboard/seller/Orders';
import SellerAnalytics from './pages/dashboard/seller/Analytics';
import AddProduct from './pages/dashboard/shared/ProductForm.jsx';
import ViewOrder from './pages/dashboard/seller/ViewOrder';

import BuyerDashboard from './pages/dashboard/buyer';
import BuyerOrders from './pages/dashboard/buyer/Orders';
import BuyerWishlist from './pages/dashboard/buyer/Wishlist';
import OrderConfirmation from './components/order/OrderConfirmation';
import OrderDetails from './components/order/OrderDetails';
import BuyerAddresses from './pages/dashboard/buyer/Addresses';
import BuyerPayments from './pages/dashboard/buyer/Payments';

// Account section components
import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import SettingsPage from './pages/account/SettingsPage';
import SecurityPage from './pages/account/SecurityPage';

import './App.css';

// Role-based route wrapper
const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate to={ROUTES.UNAUTHORIZED} state={{ from: location }} replace />
    );
  }

  return children || <Outlet />;
};

// Main App component
function App() {
  return (
    <ErrorBoundary
      fallbackTitle='Oops! Something went wrong'
      fallbackMessage="We're sorry for the inconvenience. Our team is addressing the issue. Please try refreshing the page"
      resetText='Reload Page'
      onReset={() => window.location.reload()}>
      <Layout>
        <Routes>
          {/* ========== Public Routes ========== */}
          <Route index element={<Home />} />
          <Route path={ROUTES.SHOP} element={<Shop />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetails />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.SEARCH} element={<SearchResults />} />
          <Route path={ROUTES.FAQ} element={<FAQs />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />

          {/* ========== Auth Routes ========== */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

          {/* ========== Protected Routes ========== */}
          <Route element={<ProtectedRoute />}>
            {/* Account Section */}
            <Route path={ROUTES.ACCOUNT.BASE} element={<AccountLayout />}>
              <Route
                index
                element={
                  <Navigate
                    to={ROUTES.ACCOUNT.PROFILE.split('/').pop()}
                    replace
                  />
                }
              />
              <Route
                path={ROUTES.ACCOUNT.PROFILE.split('/').pop()}
                element={<ProfilePage />}
              />
              <Route
                path={ROUTES.ACCOUNT.SETTINGS.split('/').pop()}
                element={<SettingsPage />}
              />
              <Route
                path={ROUTES.ACCOUNT.SECURITY.split('/').pop()}
                element={<SecurityPage />}
              />
            </Route>

            {/* Old Settings Route - Keeping for backward compatibility - Redirect to new account settings */}
            <Route
              path={ROUTES.SETTINGS}
              element={
                <ProtectedRoute>
                  <Navigate to={ROUTES.ACCOUNT.SETTINGS} replace />
                </ProtectedRoute>
              }
            />

            <Route path={ROUTES.HELP} element={<Help />} />
            <Route
              path={ROUTES.ORDER_CONFIRMATION}
              element={<OrderConfirmation />}
            />

            {/* Dashboard Routes */}
            <Route
              path={ROUTES.DASHBOARD.ADMIN}
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
              <Route index element={<AdminDashboard />} />
              <Route
                path={ROUTES.DASHBOARD.ADMIN_USERS.split('/').pop()}
                element={<AdminUsers />}
              />
              <Route
                path={`${ROUTES.DASHBOARD.ADMIN_USERS.split('/').pop()}/:userId`}
                element={<UserDetails />}
              />
              <Route path={ROUTES.DASHBOARD.ADMIN_PRODUCTS.split('/').pop()}>
                <Route index element={<AdminProducts />} />
                <Route path=':productId' element={<ProductDetailsPage />} />
              </Route>
              <Route
                path={ROUTES.DASHBOARD.ADMIN_ORDERS.split('/').pop()}
                element={<AdminOrders />}
              />
              <Route
                path={ROUTES.DASHBOARD.ADMIN_ANALYTICS.split('/').pop()}
                element={<AdminAnalytics />}
              />
              <Route path='support' element={<AdminSupport />} />

              {/* Category Management */}
              <Route path={ROUTES.DASHBOARD.ADMIN_CATEGORIES.split('/').pop()}>
                <Route index element={<AdminCategories />} />
                <Route path='new' element={<AddCategory />} />
                <Route path=':id/edit' element={<AddCategory />} />
              </Route>
            </Route>

            <Route
              path={ROUTES.DASHBOARD.SELLER}
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
              <Route index element={<SellerDashboard />} />
              <Route path={ROUTES.DASHBOARD.SELLER_PRODUCTS.split('/').pop()}>
                <Route index element={<SellerProducts />} />
                <Route path='new' element={<AddProduct />} />
                <Route
                  path=':productId'
                  element={<SellerProductDetailsPage />}
                />
              </Route>
              <Route
                path={ROUTES.DASHBOARD.SELLER_ORDERS.split('/').pop()}
                element={<SellerOrders />}
              />
              <Route
                path={ROUTES.DASHBOARD.SELLER_ORDER_DETAILS.split('/').pop()}
                element={<ViewOrder />}
              />
              <Route
                path={ROUTES.DASHBOARD.SELLER_ANALYTICS.split('/').pop()}
                element={<SellerAnalytics />}
              />
            </Route>

            <Route
              path={ROUTES.DASHBOARD.BUYER}
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
              <Route index element={<BuyerDashboard />} />
              <Route
                path={ROUTES.DASHBOARD.BUYER_ORDERS.split('/').pop()}
                element={<BuyerOrders />}
              />
              <Route
                path={ROUTES.DASHBOARD.BUYER_WISHLIST.split('/').pop()}
                element={<BuyerWishlist />}
              />
              <Route path='addresses' element={<BuyerAddresses />} />
              <Route path='payments' element={<BuyerPayments />} />
            </Route>
          </Route>

          {/* ========== Legal & Info ========== */}
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
          <Route path={ROUTES.TERMS} element={<TermsOfService />} />
          <Route path={ROUTES.DELIVERY_RETURNS} element={<DeliveryReturns />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

          {/* 404 - Not Found */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
