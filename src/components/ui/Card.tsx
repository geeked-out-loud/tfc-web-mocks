import React from 'react';

interface CardProps {
  image?: string;
  heading: string;
  description: string | React.ReactNode;
  price: string;
  className?: string;
  isSelected?: boolean;
  onBuyNow?: () => void;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ image, heading, description, price, className = '', isSelected = false, onBuyNow, onClick }) => {
  return (    <div 
      className={`relative bg-[#333333] rounded-lg shadow-lg cursor-pointer ${isSelected ? 'border-2 border-[#d7a900]' : 'border-2 border-transparent'} ${className}`}
      onClick={onClick}
    >      {/* Image Section - 10% taller */}
      <div className="h-[5.5rem] w-full bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={heading}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <img 
            src="/wordmark_dark.png" 
            alt="TFC Wordmark"
            className="h-10 w-auto object-contain opacity-50"
            loading="lazy"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">        {/* Heading - left aligned, DDC font */}
        <h3 className="text-white ddc-hardware text-xl font-bold mb-4 text-left">{heading}</h3>

        {/* Description - Poppins regular */}
        <div className="text-white text-sm leading-relaxed mb-12 poppins-regular">
          {description}
        </div>

        {/* Long Dashes Separator - same width as description */}
        <div className="mb-4">
          <div className="flex space-x-2">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="w-3 h-px bg-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Price - label left, price right */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-white font-ddc text-sm font-medium">
            Plan Price
          </span>
          <span className="text-white font-ddc text-2xl font-bold">
            {price}
          </span>
        </div>
      </div>      {/* Buy Now Button - positioned at bottom edge when selected */}
      {isSelected && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[85%]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow?.();
            }}
            className="w-full bg-[#d7a900] text-white ddc-hardware text-2xl py-3 rounded-md hover:bg-[#c19800] transition-colors shadow-lg"
          >
            BUY NOW
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
