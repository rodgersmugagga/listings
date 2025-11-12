import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import ListingItem from '../components/ListingItem';
import FiltersPanel from '../components/FiltersPanel';
import { fetchListings } from '../redux/listings/listingsSlice.js';
import { setCategory, setPage } from '../redux/filters/filtersSlice.js';

export default function Category(){
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: listings, status, total } = useSelector(s => s.listings || { items: [], status: 'idle', total: 0 });
  const loading = status === 'loading';
  const filters = useSelector(s => s.filters);
  const location = useLocation();

  useEffect(()=>{
    // set category in filters and reset page
    dispatch(setCategory(categoryName));
    dispatch(setPage(1));
  }, [dispatch, categoryName]);

  // react to URL changes (sort/page) and to filters changes when user applies
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const sort = q.get('sort') || filters.sort;
    const page = Number(q.get('page') || filters.page || 1);
    const params = {
      category: categoryName,
      subCategory: q.get('subCategory') || (filters.subCategory === 'all' ? undefined : filters.subCategory),
      limit: filters.limit,
      startIndex: (page - 1) * filters.limit,
      sort,
      filters: filters.filters,
    };
    dispatch(fetchListings(params));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, filters.filters, filters.page, filters.sort]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{categoryName} Listings in Uganda | Buy, Rent & Sell - Rodvers</title>
        <meta 
          name="description" 
          content={`Browse verified ${categoryName.toLowerCase()} listings in Uganda. Find the best deals on ${categoryName.toLowerCase()} with Rodvers Listings.`}
        />
        <meta 
          name="keywords" 
          content={`${categoryName} Uganda, buy ${categoryName.toLowerCase()} Uganda, sell ${categoryName.toLowerCase()} Uganda, rent ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} for sale Uganda`}
        />
        <meta name="author" content="Rodvers Tech Ltd" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${categoryName} Listings in Uganda - Rodvers`} />
        <meta property="og:description" content={`Discover verified ${categoryName.toLowerCase()} listings in Uganda. Buy, sell, or rent on Rodvers Listings.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Rodvers Listings" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${categoryName} Listings in Uganda - Rodvers`} />
        <meta name="twitter:description" content={`Discover verified ${categoryName.toLowerCase()} listings in Uganda with Rodvers Listings.`} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Uganda" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryName} Listings`,
            "description": `Browse and search ${categoryName.toLowerCase()} listings in Uganda`,
            "url": window.location.href,
            "creator": {
              "@type": "Organization",
              "name": "Rodvers Tech Ltd",
              "url": "https://listings-chvc.onrender.com"
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-2 sm:px-3 md:px-4 py-4">
        <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
          <div className='p-3 md:p-0 md:w-72'>
            <FiltersPanel compact onApply={() => {
              // build params from current filters and dispatch fetchListings
              const params = {
                category: filters.category === 'all' ? categoryName : filters.category,
                subCategory: filters.subCategory && filters.subCategory !== 'all' ? filters.subCategory : undefined,
                limit: filters.limit,
                startIndex: 0,
                sort: filters.sort,
                filters: filters.filters,
              };
              dispatch(fetchListings(params));
            }} />
          </div>

          <div className='flex-1'>
            <div className="flex justify-between items-start md:items-center mb-3 gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{categoryName}</h1>
              <div className="text-xs sm:text-sm text-gray-500">{!loading ? `${listings.length}${total ? ` of ${total}` : ''}` : 'Loading...'}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {loading ? (
                Array.from({length:6}).map((_,i)=>(<div key={i} className="animate-pulse bg-white h-60 rounded" />))
              ) : (
                listings.map(l => (
                  <article key={l._id} onClick={()=>navigate(`/listing/${l._id}`)}>
                    <ListingItem listing={l} />
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
