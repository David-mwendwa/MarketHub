import React from 'react';
import { Button } from '../../../components/ui/Button';
import { ShoppingBag, Clock, Heart, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const BuyerQuickActions = () => {
  return (
    <Card className='p-6 mb-6'>
      <h3 className='text-lg font-medium mb-4'>Quick Actions</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Button
          variant='outline'
          className='flex flex-col items-center justify-center h-32'>
          <ShoppingBag className='h-6 w-6 mb-2' />
          <span>Track Order</span>
        </Button>
        <Button
          variant='outline'
          className='flex flex-col items-center justify-center h-32'>
          <Clock className='h-6 w-6 mb-2' />
          <span>Order History</span>
        </Button>
        <Button
          variant='outline'
          className='flex flex-col items-center justify-center h-32'>
          <Heart className='h-6 w-6 mb-2' />
          <span>Wishlist</span>
        </Button>
      </div>
    </Card>
  );
};

export default BuyerQuickActions;
