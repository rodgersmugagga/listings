import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';

import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import Contact from '../components/Contact';
import ProgressiveImage from '../components/ProgressiveImage';

// SEO Helper functions
const generateTitle = (listing) => {
  if (!listing) return 'Property Listing | Real Estate Uganda';
  const type = listing.type === 'rent' ? 'for Rent' : 'for Sale';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  return `${listing.name} ${type} in ${location} | Real Estate Uganda`.substring(0, 60);
};

const generateDescription = (listing) => {
  if (!listing) return 'Find your perfect property in Uganda. Browse our selection of houses, apartments, and commercial properties for rent and sale across East Africa.';
  const type = listing.type === 'rent' ? 'for rent' : 'for sale';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  return `${listing.bedrooms} bedroom ${listing.name} ${type} in ${location}. ${listing.furnished ? 'Furnished' : 'Unfurnished'} property with ${listing.bathrooms} bathrooms${listing.parking ? ' and parking' : ''}. ${listing.description?.substring(0, 50) || ''}...`.substring(0, 160);
};

const generateKeywords = (listing) => {
  if (!listing) return 'real estate Uganda, property Uganda, houses for sale Kampala, apartments for rent Uganda';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  const type = listing.type === 'rent' ? 'rent' : 'sale';
  return `${listing.name}, property ${type} ${location}, real estate Uganda, houses ${type} Uganda, ${location} real estate, East Africa property, ${listing.bedrooms} bedroom house ${location}, ${type} property Uganda`;
};

const generateStructuredData = (listing) => {
  if (!listing) return null;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.name,
    "description": listing.description,
    "price": listing.offer ? listing.discountedPrice : listing.regularPrice,
    "priceCurrency": "UGX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressLocality": listing.address || 'Uganda'
    },
    "numberOfBedrooms": listing.bedrooms,
    "numberOfBathrooms": listing.bathrooms,
    "amenityFeature": [
      ...(listing.parking ? [{ "@type": "LocationFeatureSpecification", "name": "Parking" }] : []),
      ...(listing.furnished ? [{ "@type": "LocationFeatureSpecification", "name": "Furnished" }] : [])
    ]
  };
};

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
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
    <>
      <Helmet>
        <title>{generateTitle(listing)}</title>
        <meta name="description" content={generateDescription(listing)} />
        <meta name="keywords" content={generateKeywords(listing)} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={generateTitle(listing)} />
        <meta property="og:description" content={generateDescription(listing)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {listing?.imageUrls?.[0] && <meta property="og:image" content={listing.imageUrls[0]} />}
        <meta property="og:site_name" content="Real Estate Uganda" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateTitle(listing)} />
        <meta name="twitter:description" content={generateDescription(listing)} />
        {listing?.imageUrls?.[0] && <meta name="twitter:image" content={listing.imageUrls[0]} />}
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content={listing.address?.split(',').pop().trim() || 'Uganda'} />
        <meta name="geo.position" content="0.347596;32.582520" />
        <meta name="ICBM" content="0.347596, 32.582520" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(listing))}
        </script>
      </Helmet>

      <main>
        <Swiper navigation>
          {listing.imageUrls?.map((url, idx) => (
            <SwiperSlide key={`${url}-${idx}`}>
              <ProgressiveImage
                src={url}
                alt={`${listing.name} - ${listing.bedrooms} bedroom ${listing.type === 'rent' ? 'rental' : 'sale'} property in ${listing.address} - Image ${idx + 1}${idx === 0 ? ' (Main View)' : ''}`}
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
            <button type="button" onClick={()=>setContact(true)} className='text-white border bg-slate-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>
              Contact Owner
            </button>
          )}
          {contact && <Contact listing={listing}/>}
        </div>
      </main>
    </>
  );
}
