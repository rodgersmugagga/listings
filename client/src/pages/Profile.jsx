import { useSelector } from 'react-redux' 

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='max-w-lg mx-auto flex flex-col gap-4 p-6'>
        
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser?.user?.avatar || "https://avatars.githubusercontent.com/u/219873324?s=400&u=101a5f849e9b243737aee4b3b950c700272efb4b&v=4"} alt="profile" />

        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' />

        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>Update</button>    

      </form>

      <div className='flex justify-between gap-4 max-w-lg mx-auto p-6'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
