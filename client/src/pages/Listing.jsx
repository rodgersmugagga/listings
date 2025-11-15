import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';

import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaCar, FaMobile, FaRoad, FaCalendarAlt } from 'react-icons/fa';
import Contact from '../components/Contact';
import ProgressiveImage from '../components/ProgressiveImage';
import DetailsDisplay from '../components/DetailsDisplay';
import { resolvePrices } from '../utils/priceUtils';
import { fetchListingById, clearCurrent } from '../redux/listings/listingsSlice.js';

// SEO Helper functions — prefer nested `details` fields from the schema, fall back to legacy top-level fields
const generateTitle = (listing) => {
  if (!listing) return 'Property Listing | Real Estate Uganda';
  const type = (listing.details?.type ?? listing.type) === 'rent' ? 'for Rent' : 'for Sale';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  return `${listing.name} ${type} in ${location} | Real Estate Uganda`.substring(0, 60);
};

const generateDescription = (listing) => {
  if (!listing) return 'Find your perfect property in Uganda. Browse our selection of houses, apartments, and commercial properties for rent and sale across East Africa.';
  const type = (listing.details?.type ?? listing.type) === 'rent' ? 'for rent' : 'for sale';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  const bedrooms = listing.details?.bedrooms ?? listing.bedrooms;
  const bathrooms = listing.details?.bathrooms ?? listing.bathrooms;
  const furnished = listing.details?.furnished ?? listing.furnished;
  const parking = listing.details?.parking ?? listing.parking;
  const furnishedLabel = (typeof furnished === 'string') ? (furnished === 'Unfurnished' ? 'Unfurnished' : 'Furnished') : (furnished ? 'Furnished' : 'Unfurnished');
  const hasParking = Number(parking) > 0;
  return `${bedrooms || ''} bedroom ${listing.name} ${type} in ${location}. ${furnishedLabel} property with ${bathrooms || ''} bathrooms${hasParking ? ' and parking' : ''}. ${listing.description?.substring(0, 50) || ''}...`.substring(0, 160);
};

const generateKeywords = (listing) => {
  if (!listing) return 'real estate Uganda, property Uganda, houses for sale Kampala, apartments for rent Uganda';
  const location = listing.address?.split(',').pop().trim() || 'Uganda';
  const type = (listing.details?.type ?? listing.type) === 'rent' ? 'rent' : 'sale';
  const bedrooms = listing.details?.bedrooms ?? listing.bedrooms;
  return `${listing.name}, property ${type} ${location}, real estate Uganda, houses ${type} Uganda, ${location} real estate, East Africa property, ${bedrooms || ''} bedroom house ${location}, ${type} property Uganda`;
};

const generateStructuredData = (listing) => {
  if (!listing) return null;
  const bedrooms = listing.details?.bedrooms ?? listing.bedrooms;
  const bathrooms = listing.details?.bathrooms ?? listing.bathrooms;
  const furnished = listing.details?.furnished ?? listing.furnished;
  const parking = listing.details?.parking ?? listing.parking;
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
    "numberOfBedrooms": bedrooms,
    "numberOfBathrooms": bathrooms,
    "amenityFeature": [
      ...(Number(parking) > 0 ? [{ "@type": "LocationFeatureSpecification", "name": "Parking" }] : []),
      ...((typeof furnished === 'string' ? (furnished === 'Unfurnished' ? [] : [{ "@type": "LocationFeatureSpecification", "name": "Furnished" }]) : (furnished ? [{ "@type": "LocationFeatureSpecification", "name": "Furnished" }] : [])))
    ]
  };
};

export default function Listing() {
  SwiperCore.use([Navigation]);
  const dispatch = useDispatch();
  const params = useParams();
  const { currentListing: listing, status } = useSelector(s => s.listings || { currentListing: null, status: 'idle' });
  const { currentUser } = useSelector(state => state.user);
  const loading = status === 'loading';
  const error = status === 'failed';

  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params.listingId;
    if (id) dispatch(fetchListingById(id));
    return () => {
      dispatch(clearCurrent());
    };
  }, [dispatch, params.listingId]);

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  if (!listing) return null;
  // compute resolved prices (handles inverted regular/discounted fields)
  const { finalPrice, originalPrice } = resolvePrices(listing);

  return (
    <>
      <Helmet>
        <title>{generateTitle(listing)}</title>
        <meta name="description" content={generateDescription(listing)} />
        <meta name="keywords" content={generateKeywords(listing)} />
        <meta name="author" content={listing.seller?.username || 'Rodvers Tech Ltd'} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph - Enhanced */}
        <meta property="og:title" content={generateTitle(listing)} />
        <meta property="og:description" content={generateDescription(listing)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        {listing?.imageUrls?.[0] && <meta property="og:image" content={listing.imageUrls[0]} />}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rodvers Listings" />
        
        {/* Twitter Card - Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateTitle(listing)} />
        <meta name="twitter:description" content={generateDescription(listing)} />
        {listing?.imageUrls?.[0] && <meta name="twitter:image" content={listing.imageUrls[0]} />}
        <meta name="twitter:creator" content="@rodverslistings" />
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content={listing.address?.split(',').pop().trim() || 'Uganda'} />
        <meta name="geo.position" content="0.347596;32.582520" />
        <meta name="ICBM" content="0.347596, 32.582520" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data - Enhanced */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(listing))}
        </script>
        
        {/* Additional Structured Data - Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://listings-chvc.onrender.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": listing.category,
                "item": `https://listings-chvc.onrender.com/category/${listing.category}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": listing.name,
                "item": window.location.href
              }
            ]
          })}
        </script>
      </Helmet>

      <main>
        {/* Show images in a responsive swiper that displays 2 medium images side-by-side on >=640px */}
        <Swiper
          navigation
          slidesPerView={1}
          spaceBetween={8}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 10 },
            1024: { slidesPerView: 2, spaceBetween: 12 }
          }}
        >
          {listing.imageUrls?.map((url, idx) => (
            <SwiperSlide key={`${url}-${idx}`}>
              <ProgressiveImage
                src={url}
                alt={`${listing.name} - ${listing.details?.bedrooms ?? listing.bedrooms} bedroom ${(listing.details?.type ?? listing.type) === 'rent' ? 'rental' : 'sale'} property in ${listing.address} - Image ${idx + 1}${idx === 0 ? ' (Main View)' : ''}`}
                className="h-48 sm:h-56 md:h-64 w-full object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, (max-width: 1200px) 45vw, 600px"
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

        {/* Two-column layout: left = images + basic info, right = details + contact */}
        <div className="max-w-4xl mx-auto px-2 sm:px-3 md:px-4 p-3">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{listing.name}</h1>
              <p className="text-xl text-brand-600 font-bold mt-2">
                UGX {Number(finalPrice).toLocaleString('en-US')}{(listing.details?.type ?? listing.type) === 'rent' && ' / month'}
              </p>

              <p className="flex items-center mt-4 gap-2 text-sm text-slate-600">
                <FaMapMarkerAlt className="text-brand-600" /> {listing.address}
              </p>

              <div className="flex gap-3 mt-4">
                <p className="text-center text-white bg-red-900 w-full max-w-[200px] p-1 rounded-md">
                  {(listing.details?.type ?? listing.type) === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && originalPrice > finalPrice && (
                  <p className="text-center text-white bg-brand-800 w-full max-w-[200px] p-1 rounded-md">
                    UGX {Math.abs(originalPrice - finalPrice).toLocaleString('en-US')} Discount
                  </p>
                )}
              </div>

              <p className="text-slate-800 mt-4">
                <span className="font-semibold text-black">Description - </span> {listing.description}
              </p>
            </div>

            {/* Right column: details & contact */}
            <aside className="md:w-96 flex-shrink-0">
              {/* Show original price struck-through when there's a valid discount */}
              {listing.offer && originalPrice > finalPrice && (
                <p className="text-sm text-slate-600 line-through">UGX {originalPrice.toLocaleString('en-US')}</p>
              )}

              <div className="mt-4">
                <DetailsDisplay category={listing.category} subCategory={listing.subCategory} details={listing.details} />
              </div>

             <div className="mt-4">
                {listing.userRef !== currentUser?.user?._id && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentUser) {
                          setContact(true);
                        } else {
                          alert("Please log in first to contact the owner.");
                        }
                      }}
                      className="text-white border bg-brand-600 hover:bg-brand-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 w-full"
                    >
                      Contact Owner
                    </button>

                    {/* Render contact form only for logged-in users */}
                    {contact && currentUser && <Contact listing={listing} />}
                  </>
                )}
              </div>

            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
