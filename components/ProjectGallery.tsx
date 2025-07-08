import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

const ProjectGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextIndex = (currentImage + 1) % images.length;
    setCurrentImage(nextIndex);
  };

  const prevImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    const prevIndex = (currentImage - 1 + images.length) % images.length;
    setCurrentImage(prevIndex);
  };

  const openModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsModalOpen(false);
  };

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && !isModalOpen) {
      intervalRef.current = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % images.length);
      }, 4000); // Slower rotation for better horizontal viewing (4 seconds)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, isModalOpen, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isModalOpen) return; // Don't interfere with modal controls
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage({ stopPropagation: () => {} } as React.MouseEvent);
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage({ stopPropagation: () => {} } as React.MouseEvent);
          break;
        case ' ': // Spacebar to toggle auto-rotation
          event.preventDefault();
          setIsAutoRotating(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, currentImage, images.length]);

  return (
    <>
      {/* Image Gallery Container */}
      <div 
        className="relative w-full h-64 md:h-96 mb-6"
        onMouseEnter={() => setIsAutoRotating(false)}
        onMouseLeave={() => setIsAutoRotating(true)}
      >
        {images.map((image, index) => {
            const isActive = index === currentImage;
            
            return (
              <div
                key={index}
                className="absolute inset-0 cursor-pointer"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
                onClick={openModal}
              >
                <Image
                  src={image}
                  alt={`Project screenshot ${index + 1}`}
                  width={1800}
                  height={900}
                  className={`w-full h-full object-contain rounded-lg transition-shadow duration-800 ${
                    isActive ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg'
                  }`}
                />
              </div>
            );
          })}
        
        {/* Navigation Controls */}
        <button
          onClick={prevImage}
          className="absolute left-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
          style={{ top: 'calc(50% - 20px)' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
          style={{ top: 'calc(50% - 20px)' }}
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Auto-rotation indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
          <div className={`w-2 h-2 rounded-full transition-colors ${isAutoRotating ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-300">
            {isAutoRotating ? 'Auto' : 'Paused'}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <Image
              src={images[currentImage]}
              alt={`Enlarged project screenshot ${currentImage + 1}`}
              width={1800}
              height={900}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
            >
              <X size={24} />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
              style={{ top: 'calc(50% - 20px)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
              style={{ top: 'calc(50% - 20px)' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;