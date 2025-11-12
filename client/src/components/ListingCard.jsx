import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/favorites/favoritesSlice.js';
import LazyImage from './LazyImage.jsx';
import { resolvePrices } from '../utils/priceUtils';

export default function ListingCard({ listing, onClick }){
  const dispatch = useDispatch();
  const favs = useSelector(state => state.favorites.items || []);
  const isFav = favs.includes(listing._id || listing.id);

  const handleFav = (e) =>{
    e.stopPropagation();
    if(isFav) dispatch(removeFavorite(listing._id || listing.id));
    else dispatch(addFavorite(listing._id || listing.id));
  };

  const { finalPrice: price } = resolvePrices(listing);

  const bedrooms = listing.details?.bedrooms ?? listing.bedrooms;
  const bathrooms = listing.details?.bathrooms ?? listing.bathrooms;

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <LazyImage src={listing.imageUrls?.[0]} alt={listing.name} className="w-full h-48 object-cover" />
        {listing.isFeatured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">Featured</span>
        )}
        <button onClick={handleFav} aria-label="Add to favorites" className="absolute top-2 right-2 bg-white/80 p-1 rounded">
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      <div className="p-3">
  <h3 className="text-sm font-semibold line-clamp-2">{listing.name}</h3>
  <p className="text-brand-600 font-bold mt-1">UGX {price?.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">{listing.address}</p>

        <div className="mt-2 text-xs text-gray-600 flex gap-2 items-center">
          {bedrooms ? <span>{bedrooms} bd</span> : null}
          {bathrooms ? <span>• {bathrooms} ba</span> : null}
          <span>• {listing.category} / {listing.subCategory}</span>
        </div>
      </div>
    </article>
  );
}
