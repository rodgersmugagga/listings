import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className="bg-brand-600 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-white">Rodvers</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-brand-50 p-2 sm:p-3 rounded-lg flex items-center gap-2 flex-1 mx-3"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-brand-600" />
          </button>
        </form>

        {/* Navigation Links + Avatar (always visible) */}
        <div className="flex items-center gap-4 ml-auto">
          <Link to='/' className="text-white hover:underline">Home</Link>
          <Link to='/about' className="text-white hover:underline">About</Link>
          <Link to='/profile' className="flex-shrink-0">
            {currentUser ? (
                            <img
                className="rounded-full h-7 w-7"
                src={currentUser?.user?.avatar || "/favicon.svg"}
                alt="profile"
              />
            ) : (
              <span className='text-white hover:underline'>Sign In</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
