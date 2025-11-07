import { useEffect, useState } from 'react'
//import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'


import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'


export default function Listing() {

  SwiperCore.use([Navigation]);
  
  //const { currentUser } = useSelector(state => state.user);
  
  //const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(()=> {
      const fetchListing = async () => {
      const listingId = params.listingId;
      console.log(listingId);
        
        try {
          
          setLoading(true);
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${listingId}`);
  
          const data = await res.json();
  
          if (!res.ok || data.success === false) {
            
            setError(true);
            setLoading(false);
            console.error("Listing fetch failed:", data.message);
            
            return;
          }
  
          setListing(data);
          setLoading(false);
          console.log("Listing data:", listing);

          
  
        } catch (error) {
  
          setError(true);
          setLoading(false);
          console.error("Listing Fetch error:", error.message);
          
        }
      };
  
      fetchListing();
  
    }, [params.listingId]);
  



  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p> }
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p> }

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => <SwiperSlide key={url}>
              <div className='h-[550px]' style={{background: `url(${url}) center no-repeat `, backgroundSize: 'cover'}}>

              </div>
            </SwiperSlide> )}
          </Swiper>
        </div>
        ) }


    </main>
    
  )
}
