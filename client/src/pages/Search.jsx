
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import FiltersPanel from '../components/FiltersPanel';
import { fetchListings } from '../redux/listings/listingsSlice.js';
import { setPage } from '../redux/filters/filtersSlice.js';

export default function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const filters = useSelector(s => s.filters);
  const { items: listings, total, status } = useSelector(s => s.listings || { items: [], total: 0, status: 'idle' });
  const loading = status === 'loading';
  const [showMore, setShowMore] = useState(false);
//console.log(sidebarData);


// local handlers handled inside FiltersPanel; Search keeps URL sync and triggers fetch

  useEffect(() => {
    // Sync URL params into Redux filters on first load
    const urlParams = new URLSearchParams(location.search);
    const keyword = urlParams.get('searchTerm') || '';
    const category = urlParams.get('category') || 'all';
    const subCategory = urlParams.get('subCategory') || 'all';
    const sort = urlParams.get('sort') || 'createdAt';
    const page = Number(urlParams.get('page') || 1);

    // naive sync: dispatch setPage only
    dispatch(setPage(page));

    // Build params for API
    const params = {
      keyword,
      category: category === 'all' ? undefined : category,
      subCategory: subCategory === 'all' ? undefined : subCategory,
      sort,
      limit: filters.limit,
      startIndex: (page - 1) * filters.limit,
      filters: filters.filters,
    };

    dispatch(fetchListings(params));
    setShowMore(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, dispatch, filters.page]);

  // when the search query changes, reset to first page
  useEffect(() => {
    // when URL search changes, reset page if needed
  }, [location.search]);


  // Handle form submission - handled by FiltersPanel via onApply which should update URL

  const onShowMoreClick = () => {
    const next = filters.page + 1;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', String(next));
    navigate(`/search?${urlParams.toString()}`);
  };


  return (
  <div className='flex flex-col md:flex-row gap-1 md:gap-4'>

    <Helmet>
      <title>Search Listings in Uganda | Real Estate, Vehicles, Electronics - Rodvers</title>
      <meta
        name="description"
        content="Search verified listings across Uganda for real estate, vehicles, and electronics. Find apartments, houses, cars, motorcycles, laptops and more. Rent or buy with verified sellers."
      />
      <meta
        name="keywords"
        content="search Uganda listings, real estate Uganda, houses for sale, apartments for rent, cars for sale Uganda, motorcycles Uganda, electronics Uganda, buy sell rent Uganda"
      />
      <meta name="author" content="Rodvers Tech Ltd" />
      <link rel="canonical" href={window.location.href} />

      {/* Open Graph */}
      <meta property="og:title" content="Search Listings in Uganda - Buy, Rent & Sell" />
      <meta
        property="og:description"
        content="Discover verified listings across Uganda. Find real estate, vehicles, electronics and more with Rodvers Listings."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      {listings?.[0] && <meta property="og:image" content={listings[0].imageUrls?.[0]} />}
      <meta property="og:site_name" content="Rodvers Listings" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Search Listings in Uganda - Buy, Rent & Sell" />
      <meta
        name="twitter:description"
        content="Discover verified listings for real estate, vehicles, electronics across Uganda with Rodvers Listings."
      />
      {listings?.[0] && <meta name="twitter:image" content={listings[0].imageUrls?.[0]} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="UG" />
      <meta name="geo.placename" content="Uganda" />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Search Listings",
          "description": "Search and discover verified listings across Uganda",
          "url": window.location.href,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": listings.map((listing, index) => ({
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
          }
        })}
      </script>
    </Helmet>

    <div className='p-1 sm:p-2 md:p-0 md:w-80 md:border-r-2 md:border-b-0 border-b-2'>
      <FiltersPanel onApply={() => {
        // build url params from current filters in the store
        const q = new URLSearchParams();
        if (filters.keyword) q.set('searchTerm', filters.keyword);
        if (filters.category && filters.category !== 'all') q.set('category', filters.category);
        if (filters.subCategory && filters.subCategory !== 'all') q.set('subCategory', filters.subCategory);
        if (filters.sort) q.set('sort', filters.sort);
        q.set('page', '1');
        Object.entries(filters.filters).forEach(([k,v]) => q.set(k, String(v)));
        navigate(`/search?${q.toString()}`);
      }} />
    </div>

    <div className='flex-1'>
  <h1 className='text-2xl sm:text-3xl font-semibold border-b p-3 sm:p-4 md:p-6 text-slate-700 mt-4 md:mt-0'>Listing results: <span className='text-xs sm:text-sm text-gray-500 ml-2'>{!loading ? `${listings.length}${total ? ` of ${total}` : ''}` : ''}</span></h1>

      <section className='p-3 sm:p-4 md:p-6 flex flex-wrap gap-2 sm:gap-3 md:gap-4' aria-label="Property Listings">
        {!loading && listings.length === 0 && (
          <p className='text-lg text-slate-700'>No listing Found!</p>
        )}

        {loading && (
          <p className='text-lg text-slate-700 text-center'>Loading...</p>
        )}

        {!loading && listings && listings.map((listing) => (
          <article key={listing._id} className="w-full xs:w-[calc(50%-6px)] sm:w-[calc(50%-6px)] md:w-[calc(33.33%-8px)]">
            <ListingItem listing={listing} />
          </article>
        ))}

        {showMore && (
          <button type="button" onClick={onShowMoreClick} className='text-brand-600 p-7 hover:underline'>
            Show More
          </button>
        )}
      </section>
    </div>
  </div>
);
}