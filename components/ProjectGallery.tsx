import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

const ProjectGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative w-full h-64 md:h-96 mb-6">
        <Image
          src={images[currentImage]}
          alt={`Project screenshot ${currentImage + 1}`}
          width={1800}
          height={900}
          className="w-full h-full object-contain rounded-lg cursor-pointer"
          onClick={openModal}
        />
        <button
          onClick={prevImage}
          className="absolute left-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
          style={{ top: 'calc(50% - 20px)' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
          style={{ top: 'calc(50% - 20px)' }}
        >
          <ChevronRight size={24} />
        </button>
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