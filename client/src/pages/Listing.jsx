import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import Contact from '../components/Contact';
import ProgressiveImage from '../components/ProgressiveImage';

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
    // Get the logged-in user from Redux
  const { currentUser } = useSelector(state => state.user);

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
        {listing.imageUrls?.map((url, idx) => (
          <SwiperSlide key={`${url}-${idx}`}>
            {/* ProgressiveImage handles responsive srcSet, LQIP and shimmer */}
            <ProgressiveImage
              src={url}
              alt={`${listing.name} image ${idx + 1}`}
              className="h-[550px] w-full"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 900px, 1200px"
              priority={idx === 0}
            />
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
              UGX { (Number(listing.regularPrice) - Number(listing.discountedPrice)).toLocaleString('en-US') } Discount
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
        {currentUser && listing.userRef !== currentUser?.user?._id && !contact && (
          <button type="button" onClick={()=>setContact(true)} className='text-white border bg-slate-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>Contact Owner</button>
        )}
        {contact && <Contact listing={listing}/>}
      </div>
    </main>
  );
}
