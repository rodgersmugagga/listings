import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;

      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${listingId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          console.error("Listing fetch failed:", res.statusText);
          return;
        }

        setListing(data);
      } catch (err) {
        setError(true);
        console.error("Listing fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  if (!listing) return null;

  return (
    <main>
      <Swiper navigation>
        {listing.imageUrls?.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="h-[550px]"
              style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center bg-slate-100 cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <FaShare className="text-slate-500" />
      </div>

      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 p-2 rounded-md bg-slate-100">
          Link Copied
        </p>
      )}

      <div className="flex flex-col max-w-4xl mx-auto p-3 gap-4">
        <p className="text-2xl font-semibold">
          {listing.name} - UGX{' '}
          {listing.offer 
            ? Number(listing.discountedPrice).toLocaleString('en-US') 
            : Number(listing.regularPrice).toLocaleString('en-US')}
          {listing.type === 'rent' && ' / month'}

        </p>

        <p className="flex items-center mt-6 gap-2 text-sm text-slate-600">
          <FaMapMarkerAlt className="text-green-700" /> {listing.address}
        </p>

        <div className="flex gap-4">
          <p className="text-center text-white bg-red-900 w-full max-w-[200px] p-1 rounded-md">
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {listing.offer && (
            <p className="text-center text-white bg-green-900 w-full max-w-[200px] p-1 rounded-md">
              UGX { (Number(listing.regularPrice) - Number(listing.discountedPrice)).toLocaleString('en-US') }
            </p>
          )}
        </div>

        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span> {listing.description}
        </p>

        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg" />{' '}
            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
          </li>

          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg" />{' '}
            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
          </li>

          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaParking className="text-lg" /> {listing.parking ? 'Parking Spot' : 'No Parking'}
          </li>

          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaChair className="text-lg" /> {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>
      </div>
    </main>
  );
}
