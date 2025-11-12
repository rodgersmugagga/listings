import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import ProgressiveImage from './ProgressiveImage';
import LazyImage from './LazyImage.jsx';
import { resolvePrices } from '../utils/priceUtils';

export default function ListingItem({ listing }) {
  const now = new Date();
  const isFeatured = listing?.isFeatured && listing?.featuredUntil && new Date(listing.featuredUntil) > now;
  const isBoosted = listing?.boosted && listing?.boostedUntil && new Date(listing.boostedUntil) > now;

  // Prefer schema-aligned nested `details` fields; fall back to legacy top-level fields
  const bedrooms = listing.details?.bedrooms ?? listing.bedrooms;
  const bathrooms = listing.details?.bathrooms ?? listing.bathrooms;
  const type = listing.details?.type ?? listing.type;
  const { finalPrice: price, discountAmount } = resolvePrices(listing);

  return (
    <div className='relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
      {isFeatured && (
        <div className='absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold z-20'>Featured</div>
      )}
      {isBoosted && !isFeatured && (
        <div className='absolute top-2 left-2 bg-brand-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold z-20'>Boosted</div>
      )}
      <Link to={`/listing/${listing._id}`}>
            <div className='h-[200px] sm:h-[240px] md:h-[220px] w-full overflow-hidden'>
              <LazyImage src={listing.imageUrls?.[0]} alt={`${listing.name} cover`} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' />
            </div>
        <div className='p-2 flex flex-col gap-1.5 w-full'>
          <p className='truncate text-sm sm:text-base font-semibold border-b pb-1.5 text-slate-700'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-xs sm:text-sm text-gray-500 truncate w-full'>{listing.address}</p>
          </div>
          <p className='text-xs sm:text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <div className=' text-gray-600 font-semibold mt-1'>
            <span className='text-base sm:text-lg text-brand-600 font-bold'>UGX {Number(price).toLocaleString('en-US')}{type === 'rent' && ' / month'}</span>
            {listing.offer && (
              <div className='text-xs text-gray-500'>Save UGX {Number(discountAmount).toLocaleString('en-US')}</div>
            )}
          </div>
          <div className='text-slate-700 flex gap-2 mt-1'>
            <div className='font-bold text-xs'>
              {bedrooms ? (bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`) : '—'}
            </div>
            <div className='font-bold text-xs'>
              {bathrooms ? (bathrooms > 1 ? `${bathrooms} baths` : `${bathrooms} bath`) : '—'}
            </div>

          </div>
        </div>
      </Link>
    </div>
  )
}
