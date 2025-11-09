import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Rodvers</span>
            <span className="text-slate-700 ml-1">Listings</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center gap-2 flex-1 mx-3"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* Desktop Links + Avatar */}
        <div className="hidden sm:flex items-center gap-4 ml-auto">
          <Link to='/' className="text-slate-700 hover:underline">Home</Link>
          <Link to='/about' className="text-slate-700 hover:underline">About</Link>
          <Link to='/profile' className="flex-shrink-0">
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover flex-shrink-0'
                src={currentUser?.user?.avatar || "https://avatars.githubusercontent.com/u/219873324?s=400&u=101a5f849e9b243737aee4b3b950c700272efb4b&v=4"}
                alt="profile"
              />
            ) : (
              <span className='text-slate-700 hover:underline'>Sign In</span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden flex items-center ml-auto">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-100 p-4 flex flex-col gap-2">
          <Link to='/' onClick={() => setMenuOpen(false)} className="text-slate-700 hover:underline">Home</Link>
          <Link to='/about' onClick={() => setMenuOpen(false)} className="text-slate-700 hover:underline">About</Link>
          <Link to='/profile' onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover flex-shrink-0'
                src={currentUser?.user?.avatar || "https://avatars.githubusercontent.com/u/219873324?s=400&u=101a5f849e9b243737aee4b3b950c700272efb4b&v=4"}
                alt="profile"
              />
            ) : (
              <span className='text-slate-700 hover:underline'>Sign In</span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
