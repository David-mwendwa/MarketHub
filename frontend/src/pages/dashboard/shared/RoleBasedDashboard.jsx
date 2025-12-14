import React from 'react';
import { useParams } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import SellerDashboard from '../dashboard/seller/SellerDashboard';
import BuyerDashboard from '../dashboard/buyer/BuyerDashboard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { AlertCircle } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { role } = useParams();

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'seller':
        return <SellerDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      default:
        return (
          <Card className='border-red-200 bg-red-50'>
            <CardHeader className='flex flex-row items-center space-x-2 text-red-600'>
              <AlertCircle className='h-5 w-5' />
              <CardTitle>Invalid Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This dashboard is not available for your role.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </h2>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default RoleBasedDashboard;
