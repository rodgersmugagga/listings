import React from 'react';

export default function SkeletonCard(){
  return (
    <div className="animate-pulse p-4 border rounded-md bg-white">
      <div className="bg-gray-200 h-40 w-full mb-3 rounded"></div>
      <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded"></div>
      <div className="h-4 bg-gray-200 w-1/2 mb-2 rounded"></div>
      <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
    </div>
  );
}
