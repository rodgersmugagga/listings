import React from 'react';
import LazyImage from './LazyImage.jsx';

export default function Carousel({ items = [] }){
  // very small, dependency-free carousel: horizontally scrollable cards
  return (
    <div className="w-full overflow-x-auto py-3">
      <div className="flex gap-3 px-2">
        {items.map(item => (
          <div key={item._id || item.id} className="min-w-[280px] bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-44 w-full">
              <LazyImage src={item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold">{item.name}</h4>
              <p className="text-xs text-gray-500">UGX {((item.offer && item.discountedPrice) || item.regularPrice)?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
