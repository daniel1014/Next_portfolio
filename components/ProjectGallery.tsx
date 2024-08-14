import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-96 mb-6">
      <img
        src={images[currentImage]}
        alt={`Project screenshot ${currentImage + 1}`}
        className="w-full h-full object-contain rounded-lg"
      />
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ProjectGallery;