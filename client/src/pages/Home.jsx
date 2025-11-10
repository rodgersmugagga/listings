import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaList } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';
import ProgressiveImage from '../components/ProgressiveImage';

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  // saleListings logged for debugging previously; removed to reduce noise in production


  useEffect(() => {

     const fetchOfferListings = async () => {

      try {
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
        
      } catch (err) {
        console.error("Listings fetch error:", err.message);
     }
    };

    const fetchRentListings = async () => {
      try {
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
        
      } catch (err) {
        console.error("Listings fetch error:", err.message);
     }
    };

    const fetchSaleListings = async () => {
      try {
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);

      } catch (err) {
        console.error("Listings fetch error:", err.message);
     }
    };

    fetchOfferListings();

  }, []); 


  return (
    <div>
      <Helmet>
        <title>Real Estate in Uganda - Buy, Rent & Sell Properties</title>
        <meta
          name="description"
          content="Discover properties for sale and rent in Uganda. Browse apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
        />
        <meta
          name="keywords"
          content="real estate Uganda, houses for sale Kampala, apartments for rent Mbarara, property for sale Uganda, rental homes East Africa"
        />
        <link rel="canonical" href={window.location.href} />

        {/* Open Graph */}
        <meta property="og:title" content="Real Estate in Uganda - Buy, Rent & Sell Properties" />
        <meta
          property="og:description"
          content="Browse apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {offerListings?.[0] && <meta property="og:image" content={offerListings[0].imageUrls?.[0]} />}
        <meta property="og:site_name" content="Real Estate Uganda" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Real Estate in Uganda - Buy, Rent & Sell Properties" />
        <meta
          name="twitter:description"
          content="Browse apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
        />
        {offerListings?.[0] && <meta name="twitter:image" content={offerListings[0].imageUrls?.[0]} />}

        {/* Regional meta */}
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Uganda" />
        <meta name="geo.position" content="1.3733;32.2903" />
        <meta name="ICBM" content="1.3733,32.2903" />

        {/* Optional: structured data for homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Real Estate Uganda",
            "url": window.location.href,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${window.location.origin}/search?query={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* top */}
      <div className='flex flex-col gap-5 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'><span className="text-green-700">Buy</span> Smart. <span className="text-red-700">Sell</span> Fast.</h1>
        <div className='text-slate-700 text-xs sm:text-sm'>
          A trusted marketplace for simple, secure, and local deals.<br />Connecting people in your area to buy and sell quickly, easily, and safely.
        </div>
        <Link to={"/search"} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline' >
          Browse Through...
        </Link>
      </div>



      {/* swiper */}
      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings?.map((listing, idx) => (
          <SwiperSlide key={listing._id}>
            <div className="h-[550px] w-full">
              <ProgressiveImage
                src={listing.imageUrls?.[0]}
                
                alt={`${listing.name} - ${listing.type} property in ${listing.address}, Uganda`}

                className="h-[550px] w-full"
                sizes="100vw"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>





      {/* listing results for offer, sale and rent */}
          <div className='flex flex-col gap-8 p-3 max-w-6xl mx-auto my-10'>
            {offerListings && offerListings.length > 0 && (
      <section aria-labelledby="recent-offers">
        <div className="flex justify-between items-center mb-2">
          <h2 id="recent-offers" className='text-slate-600 font-semibold text-2xl'>Recent Offers</h2>
          <Link to={'/search?offer=true'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>
            See More Offers
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id}/>
          ))}
        </div>

        {/* Structured data for offers */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": offerListings.map((listing, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${window.location.origin}/listing/${listing._id}`,
                "name": listing.name,
                "image": listing.imageUrls?.[0],
                "description": listing.description,
                "offers": {
                  "@type": "Offer",
                  "price": listing.offer ? listing.discountedPrice : listing.regularPrice,
                  "priceCurrency": "UGX",
                  "availability": "https://schema.org/InStock"
                }
              }))
            })}
          </script>
        </Helmet>
      </section>
    )}

    {rentListings && rentListings.length > 0 && (
      <section aria-labelledby="recent-rent">
        <div className="flex justify-between items-center mb-2">
          <h2 id="recent-rent" className='text-slate-600 font-semibold text-2xl'>Recent Places For Rent</h2>
          <Link to={'/search?type=rent'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>
            See More Places For Rent
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {rentListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id}/>
          ))}
        </div>

        {/* Structured data for rent listings */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": rentListings.map((listing, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${window.location.origin}/listing/${listing._id}`,
                "name": listing.name,
                "image": listing.imageUrls?.[0],
                "description": listing.description,
                "offers": {
                  "@type": "Offer",
                  "price": listing.regularPrice,
                  "priceCurrency": "UGX",
                  "availability": "https://schema.org/InStock"
                }
              }))
            })}
          </script>
        </Helmet>
      </section>
    )}

    {saleListings && saleListings.length > 0 && (
      <section aria-labelledby="recent-sale">
        <div className="flex justify-between items-center mb-2">
          <h2 id="recent-sale" className='text-slate-600 font-semibold text-2xl'>Recent Places for Sale</h2>
          <Link to={'/search?type=sale'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>
            See More Places For Sale
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {saleListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id}/>
          ))}
        </div>

        {/* Structured data for sale listings */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": saleListings.map((listing, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${window.location.origin}/listing/${listing._id}`,
                "name": listing.name,
                "image": listing.imageUrls?.[0],
                "description": listing.description,
                "offers": {
                  "@type": "Offer",
                  "price": listing.regularPrice,
                  "priceCurrency": "UGX",
                  "availability": "https://schema.org/InStock"
                }
              }))
            })}
          </script>
        </Helmet>
      </section>
    )}

      </div>
    </div>
  )
}
