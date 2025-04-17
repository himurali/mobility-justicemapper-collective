
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface IssueImageProps {
  imageUrl: string | null;
  title: string;
  id: string;
}

const IssueImage: React.FC<IssueImageProps> = ({ imageUrl, title, id }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.error("Failed to load image for issue:", id, "URL:", imageUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log("Successfully loaded image for issue:", id);
    setImageLoaded(true);
  };

  // Use placeholder for testing if no image URL is provided
  if (!imageUrl && parseInt(id, 10) === 1) {
    imageUrl = "https://fastly.picsum.photos/id/478/200/200.jpg?hmac=YfKBYcZHT991lmrKfB0pYNaztmUvQecXbVrc5V4mj8E";
    console.log("Using test placeholder image for issue 1:", imageUrl);
  }

  // Normalize image URL if needed
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `https://${imageUrl}`;
    console.log("Normalized image URL:", imageUrl);
  }

  if (!imageUrl) {
    return (
      <div className="mb-2 w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
        <ImageIcon className="h-8 w-8 text-gray-400" />
        <span className="text-xs text-gray-500 ml-2">
          No image available
        </span>
      </div>
    );
  }

  return (
    <div className="mb-2 w-full h-24 rounded-md overflow-hidden bg-gray-100 relative">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="eager"
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">Loading image...</div>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <span className="text-xs text-gray-500 ml-2">Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default IssueImage;
