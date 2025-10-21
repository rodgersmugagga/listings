import React from 'react'

export default function CreateListing() {
  return (
    <main className='max-w-4xl mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

      <form className=" flex flex-col sm:flex-row gap-4" >

        <div className='flex flex-col gap-4 p-6 flex-1'>
          <input type="text" placeholder="name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required/>
          <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" maxLength="62" minLength="10" required/>
          <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required/>
        

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="sale"/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="rent"/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="parking"/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="furnished"/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="offer"/>
              <span>Offer</span>
            </div>
          </div>


          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="bedrooms" min="1" max="10" required />
              <p>Beds</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="bathrooms" min="1" max="10" required />
              <p>Baths</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="regularPrice" min="1" max="10" required />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>Ugx / month</span>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="discountPrice" min="1" max="10" required />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
              <span className='text-xs'>Ugx / month</span>
              </div>
            </div>
            
          </div>


        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:</p>
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          <div className='flex gap-4'>
          <input className='p-3 border border-gray-300 rounded-lg w-full' type="file" id="images" accept="image/*" multiple/>
          <button className='text-green-700 border border-green-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>Upload</button>
          
          </div>
          <button className='text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>Create Listing</button>
        </div>


      </form>


    </main>
  )
}
