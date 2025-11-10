
import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { Helmet } from 'react-helmet-async';

export default function Search() {
  const [listings, setListings] = useState([]);
 //console.log(listings);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',

});

//console.log(sidebarData);


const handleChange =(e) => {
  if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
    setSidebarData({...sidebarData, type: e.target.id});
  }

  if(e.target.id === 'searchTerm'){
    setSidebarData({...sidebarData, searchTerm: e.target.value});
  }

  if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
    setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,});
  }

  if(e.target.id === 'sort_order'){
    const sort = e.target.value.split('_')[0] || 'created_at';
    const order = e.target.value.split('_')[1] || 'desc';
    setSidebarData({...sidebarData, sort, order});
  }


};

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const offerFromUrl = urlParams.get('offer');
    const furnishedFromUrl = urlParams.get('furnished');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    

    if(searchTermFromUrl || parkingFromUrl || offerFromUrl || furnishedFromUrl || sortFromUrl || orderFromUrl || typeFromUrl){
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',

      });
    }


     const fetchListings = async () => {
      const searchQuery = urlParams.toString();

      try {
        setShowMore(false);
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if (data.length > 8) {

          setShowMore(true);
        }else{
          setShowMore(false);
        }


        setListings(data);
        setLoading(false);
      } catch (err) {
        
        console.error("Listings fetch error:", err.message);
        setLoading(false);
     
     }
    };

    fetchListings();

  }, [location.search]);  


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const urlParams = new URLSearchParams();

      urlParams.set('searchTerm', sidebarData.searchTerm);
      urlParams.set('type', sidebarData.type);
      urlParams.set('parking', sidebarData.parking);
      urlParams.set('furnished', sidebarData.furnished);
      urlParams.set('offer', sidebarData.offer);
      urlParams.set('sort', sidebarData.sort);
      urlParams.set('order', sidebarData.order);

      const searchQuery = urlParams.toString();

      navigate(`/search?${searchQuery}`);

     } catch (error) {
      console.log(error);
     }
  }; 

  const onShowMoreClick = async () => {
    const numberOfListing = listings.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams();
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {

      setShowMore(false);
    }

    setListings([...listings, ...data]);

    
  }; 


  return (
  <div className='flex flex-col md:flex-row'>

    <Helmet>
      <title>Search Properties in Uganda - Rent, Sale & Offers</title>
      <meta
        name="description"
        content="Search properties for rent, sale, and offers in Uganda. Find apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
      />
      <meta
        name="keywords"
        content="real estate Uganda, houses for sale, apartments for rent, property offers Uganda, rental homes East Africa"
      />
      <link rel="canonical" href={window.location.href} />

      {/* Open Graph */}
      <meta property="og:title" content="Search Properties in Uganda - Rent, Sale & Offers" />
      <meta
        property="og:description"
        content="Search apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      {listings?.[0] && <meta property="og:image" content={listings[0].imageUrls?.[0]} />}
      <meta property="og:site_name" content="Real Estate Uganda" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Search Properties in Uganda - Rent, Sale & Offers" />
      <meta
        name="twitter:description"
        content="Search apartments, houses, and commercial real estate across Kampala, Mbarara, Jinja, and more."
      />
      {listings?.[0] && <meta name="twitter:image" content={listings[0].imageUrls?.[0]} />}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
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
        })}
      </script>
    </Helmet>

    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>

        <div className='flex items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>Search Term: </label>
          <input
            type="text"
            placeholder="Search..."
            className="border w-full p-3 rounded-lg"
            id="searchTerm"
            onChange={handleChange}
            value={sidebarData.searchTerm}
          />
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>Type: </label>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="all" onChange={handleChange} checked={sidebarData.type === 'all'} />
            <span>Rent & Sale</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={sidebarData.type === 'rent'} />
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={sidebarData.type === 'sale'} />
            <span>Sale</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={sidebarData.offer} />
            <span>Offer</span>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>Amenities: </label>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="parking" onChange={handleChange} checked={sidebarData.parking} />
            <span>Parking</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" className="w-5" id="furnished" onChange={handleChange} checked={sidebarData.furnished} />
            <span>Furnished</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>Sort: </label>
          <select
            onChange={handleChange}
            defaultValue={'created_at_desc'}
            className="border p-3 rounded-lg"
            id="sort_order"
          >
            <option value='regularPrice_desc'>Price High to Low</option>
            <option value='regularPrice_asc'>Price Low to High</option>
            <option value='createdAt_desc'>Latest</option>
            <option value='createdAt_asc'>Oldest</option>
          </select>
        </div>

        <button className='text-white border bg-slate-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>
          Search
        </button>
      </form>
    </div>

    <div className='flex-1'>
      <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results: </h1>

      <section className='p-7 flex flex-wrap gap-4' aria-label="Property Listings">
        {!loading && listings.length === 0 && (
          <p className='text-lg text-slate-700'>No listing Found!</p>
        )}

        {loading && (
          <p className='text-lg text-slate-700 text-center'>Loading...</p>
        )}

        {!loading && listings && listings.map((listing) => (
          <article key={listing._id} className="w-full sm:w-[48%] md:w-[32%]">
            <ListingItem listing={listing} />
          </article>
        ))}

        {showMore && (
          <button type="button" onClick={onShowMoreClick} className='text-green-700 p-7 hover:underline'>
            Show More
          </button>
        )}
      </section>
    </div>
  </div>
);
}