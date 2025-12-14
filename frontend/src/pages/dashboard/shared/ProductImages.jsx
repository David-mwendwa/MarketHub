import { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const ProductImages = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (images.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg'>
        <ImageIcon className='h-12 w-12 text-muted-foreground mb-2' />
        <p className='text-muted-foreground'>No images available</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-muted'>
        {selectedImage || images[0] ? (
          <img
            src={selectedImage || images[0]}
            alt='Main product'
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <ImageIcon className='h-12 w-12 text-muted-foreground' />
          </div>
        )}

        {selectedImage && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm'
            onClick={() => setSelectedImage(null)}>
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-2'>
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square overflow-hidden rounded-md ${
                selectedImage === img || (!selectedImage && index === 0)
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}>
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className='h-full w-full object-cover'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity'>
                <ZoomIn className='h-5 w-5 text-white' />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image Upload (for future implementation) */}
      <div className='pt-4'>
        <Button variant='outline' size='sm' className='w-full'>
          Add Images
        </Button>
      </div>
    </div>
  );
};

export default ProductImages;
