import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
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
                alt={`${listing.name} hero`}
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
          <div>
            <div>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Offers</h2>
              <Link to={'/search?offer=true'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline' >
                See More Offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}

         {rentListings && rentListings.length > 0 && (
          <div>
            <div>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Places For Rent</h2>
              <Link to={'/search?type=rent'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline' >
                See More Places For Rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}

         {saleListings && saleListings.length > 0 && (
          <div>
            <div>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Places for Sale</h2>
              <Link to={'/search?type=sale'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline' >
                See More Places For Sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
