import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ProductImages = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg'>
        <ImageIcon className='h-12 w-12 text-muted-foreground mb-2' />
        <p className='text-muted-foreground'>No images available</p>
      </div>
    );
  }

  // Handle both string and object formats
  const getImageUrl = (img, type = 'full') => {
    if (!img) return '';
    return typeof img === 'string'
      ? img
      : img[type] || img.full || img.thumbnail || '';
  };

  const currentImage = getImageUrl(images[selectedImage] || images[0]);

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-muted'>
        {currentImage ? (
          <img
            src={currentImage}
            alt='Main product'
            className='h-full w-full object-contain'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://via.placeholder.com/500x500?text=Image+Not+Available';
            }}
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <ImageIcon className='h-12 w-12 text-muted-foreground' />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-2'>
          {images.map((img, index) => {
            const thumbnailUrl =
              getImageUrl(img, 'thumbnail') || getImageUrl(img);
            return (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                  selectedImage === index
                    ? 'border-primary'
                    : 'border-transparent'
                }`}>
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center bg-muted'>
                    <ImageIcon className='h-6 w-6 text-muted-foreground' />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
