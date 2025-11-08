import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>

      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'>

          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term: </label>
            <input type="text" placeholder="Search..." className="border w-full p-3 rounded-lg" id="searchTerm"/>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Type: </label>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="all"/>
              <span>Rent & Sale</span>
            </div>

            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="rent"/>
              <span>Rent</span>
            </div>

            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="sale"/>
              <span>Sale</span>
            </div>

            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="offer"/>
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Amenities: </label>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="parking"/>
              <span>Parking</span>
            </div>

            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="furnished"/>
              <span>Furnished</span>
            </div>
          </div> 

          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Sort: </label>
            <select  className="border p-3 rounded-lg" id="sort_order">
              <option>Price High to Low</option>
              <option>Price Low to High</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div> 

           <button type="button" className='text-white border bg-slate-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>Search</button>                  

        </form>
      </div>

      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results: </h1>
      </div>

    </div>
  )
}
