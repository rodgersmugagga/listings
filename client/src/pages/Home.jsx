import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaCar, FaMobileAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured, fetchListings } from '../redux/listings/listingsSlice.js';
import Carousel from '../components/Carousel.jsx';
import ListingCard from '../components/ListingCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';

const CATEGORIES = [
  { key: 'Real Estate', title: 'Real Estate', subs: ['Apartment', 'House', 'Land', 'Commercial'], icon: FaHome },
  { key: 'Vehicles', title: 'Vehicles', subs: ['Car', 'Motorcycle', 'Truck', 'Bus'], icon: FaCar },
  { key: 'Electronics', title: 'Electronics', subs: ['Mobile Phone', 'Laptop', 'TV', 'Camera'], icon: FaMobileAlt },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { featured } = useSelector(s => s.listings || { featured: [] });
  const { items, status } = useSelector(s => s.listings || { items: [], status: 'idle' });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(()=>{
    dispatch(fetchFeatured());
    dispatch(fetchListings({ page: 1, limit: 12 }));
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Rodvers Listings | Buy, Rent & Sell in Uganda - Real Estate, Cars, Electronics</title>
        <meta
          name="description"
          content="Uganda's trusted online platform to buy, rent, and sell properties, vehicles, and electronics. Browse verified listings for houses, apartments, land, cars, motorcycles, and more. Create free listings and reach thousands of buyers."
        />
        <meta
          name="keywords"
          content="Uganda listings, buy house Uganda, rent apartments Uganda, sell property Uganda, cars for sale Uganda, motorcycles, laptops, electronics Uganda, real estate Uganda, Kampala listings"
        />
        <meta name="author" content="Rodgers Mugagga, Rodvers Tech Ltd" />
        <link rel="canonical" href="https://listings-chvc.onrender.com/" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Rodvers Listings | Buy, Rent & Sell in Uganda" />
        <meta property="og:description" content="Find verified listings across Uganda for real estate, vehicles, and electronics. Post your ad in minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://listings-chvc.onrender.com/" />
        <meta property="og:image" content="https://listings-chvc.onrender.com/og-image.jpg" />
        <meta property="og:site_name" content="Rodvers Listings" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rodvers Listings | Buy, Rent & Sell in Uganda" />
        <meta name="twitter:description" content="Browse verified listings in Uganda for real estate, vehicles, and electronics." />
        <meta name="twitter:image" content="https://listings-chvc.onrender.com/og-image.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Uganda" />
        
        {/* Structured Data - Homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Rodvers Listings",
            "url": "https://listings-chvc.onrender.com",
            "description": "Uganda's trusted online marketplace for buying, selling, and renting properties, vehicles, and electronics",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://listings-chvc.onrender.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/" className="flex items-center gap-1 sm:gap-2 text-brand-600 font-bold text-base sm:text-lg whitespace-nowrap">
                <FaPlus className="text-brand-600 text-sm sm:text-base" />
                <span className="hidden sm:inline">Rodvers Listings</span>
              </Link>
                <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 min-w-0 gap-1">
                <input
                  aria-label="Search"
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                  placeholder="Search listings"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                  <button type="submit" className="text-slate-600 hover:text-slate-800">
                    <span className="sr-only">Search</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <FaMapMarkerAlt className="text-xs" />
                <span>Kampala</span>
              </div>
              <Link to="/create-listing" className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap">
                Post Ad
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white mt-4 sm:mt-6">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">
              Buy and Sell Across Uganda — Fast and Secure.
            </h1>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600">
              Find verified sellers, post ads in minutes, and reach buyers across Kampala, Mbarara, Jinja and beyond.
            </p>
            <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              <Link to="/create-listing" className="bg-brand-600 hover:bg-brand-700 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                Post Your Ad
              </Link>
              <Link to="/search" className="px-3 sm:px-5 py-2 sm:py-3 rounded-lg border border-gray-200 text-xs sm:text-sm">
                Browse Listings
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/favicon.svg"
              alt="Buy and sell across Uganda"
              className="rounded-lg shadow-md w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                to={`/category/${encodeURIComponent(cat.key)}`}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md flex items-center gap-3 whitespace-nowrap"
              >
                <div className="p-2 bg-brand-50 rounded-md text-brand-600">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base">{cat.title}</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {cat.subs.length} subcategories
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Featured listings</h2>
          <Link to="/search?featured=true" className="text-xs sm:text-sm text-brand-600">
            See all
          </Link>
        </div>
        {featured?.length ? (
          <Carousel items={featured} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
            {Array.from({length:3}).map((_,i)=>(<SkeletonCard key={i} />))}
          </div>
        )}
      </section>

      {/* Latest Listings */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Latest listings</h2>
          <Link to="/search" className="text-xs sm:text-sm text-brand-600">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
          {status === 'loading' ? (
            Array.from({length:6}).map((_,i)=>(<SkeletonCard key={i} />))
          ) : (
            items.map(item => (
              <ListingCard key={item._id || item.id} listing={item} onClick={()=>window.location.href=`/listing/${item._id || item.id}`} />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-6 sm:mt-8 border-t">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h4 className="font-bold text-brand-600">Rodvers Tech Ltd</h4>
            <p className="text-sm text-gray-600">© Rodvers Tech Ltd</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link to="/about" className="text-sm text-gray-600">About Us</Link>
            <Link to="/contact" className="text-sm text-gray-600">Contact</Link>
            <Link to="/privacy" className="text-sm text-gray-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
