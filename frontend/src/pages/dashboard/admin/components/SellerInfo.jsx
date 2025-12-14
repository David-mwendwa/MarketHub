import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import {
  User,
  Mail,
  Star,
  Calendar as CalendarIcon,
  Package,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerInfo = ({ seller }) => {
  const navigate = useNavigate();

  if (!seller) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            No seller information available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center justify-between'>
          <span>Seller Information</span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate(`/dashboard/admin/sellers/${seller.id}`)}>
            View
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center space-x-3'>
          <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
            <User className='h-5 w-5 text-primary' />
          </div>
          <div>
            <p className='font-medium'>{seller.name}</p>
            <p className='text-sm text-muted-foreground'>ID: {seller.id}</p>
          </div>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex items-center space-x-2'>
            <Mail className='h-4 w-4 text-muted-foreground' />
            <span className='truncate'>{seller.email}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Star className='h-4 w-4 text-yellow-500 fill-yellow-500/20' />
            <span>{seller.rating?.toFixed(1) || 'N/A'} / 5.0</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Package className='h-4 w-4 text-muted-foreground' />
            <span>{seller.totalProducts || 0} products</span>
          </div>
          <div className='flex items-center space-x-2'>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
            <span>
              Joined {new Date(seller.joinedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className='pt-2 space-y-2'>
          <Button
            variant='outline'
            size='sm'
            className='w-full'
            onClick={() => navigate(`/dashboard/admin/sellers/${seller.id}`)}>
            View Seller Profile
          </Button>

          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1'
              disabled={seller.status === 'active'}>
              <Check className='mr-2 h-4 w-4' />
              Approve
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='flex-1'
              disabled={seller.status === 'suspended'}>
              <AlertTriangle className='mr-2 h-4 w-4' />
              Suspend
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
