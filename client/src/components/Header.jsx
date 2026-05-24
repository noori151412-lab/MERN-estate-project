import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const messages = [
    { text: "Your Gateway to Luxury —", color: "text-amber-500/80", italic: true },
    { text: "Exquisite Living Spaces —", color: "text-slate-100", italic: false },
    { text: "Premium Real Estate —", color: "text-amber-500/80", italic: true },
  ];
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setIsSearchOpen(false);
  };

  return (
    <header className='bg-[#0F172A] shadow-md fixed top-0 left-0 w-full z-50 border-b border-white/5'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 relative z-50 bg-[#0F172A]'>

        {/* Left Side: Logo and Brand Name */}
        <Link to='/' className='shrink-0'>
          <div className='flex items-center gap-2 hover:opacity-90 transition-opacity'>
            <img
              src="/favicon.png"
              alt="Vantura Estates Logo"
              className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
            />
            
            <h1 className='font-bold text-sm sm:text-lg flex flex-wrap tracking-wider'>
              <span className='text-slate-100'>Vantura</span>
              <span className='text-amber-500 ml-1 hidden sm:inline'>Estates</span>
            </h1>
          </div>
        </Link>

        {/* Center: Animated Slogan*/}
        <div className='flex flex-1 max-w-30 sm:max-w-xs md:max-w-lg mx-2 sm:mx-4 relative items-center overflow-hidden'>
          <div className='flex whitespace-nowrap animate-marquee-infinite w-full'>
            {/* Group 1 */}
            <div className='flex shrink-0 items-center'>
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`${msg.color} ${msg.italic ? 'italic' : ''} font-serif tracking-widest text-[8px] sm:text-xs uppercase py-0.5 px-2 sm:px-10 border-l border-amber-500/20`}
                >
                  {msg.text}
                </p>
              ))}
            </div>

            {/* Group 2 */}
            <div className='flex shrink-0 items-center'>
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`${msg.color} ${msg.italic ? 'italic' : ''} font-serif tracking-widest text-[8px] sm:text-xs uppercase py-0.5 px-2 sm:px-10 border-l border-amber-500/20`}
                >
                  {msg.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Navigation & Search Icon */}
        <div className='flex items-center gap-1 sm:gap-4 shrink-0'>
          <ul className='flex gap-2 sm:gap-5 items-center text-xs sm:text-sm font-medium'>

            {/* Search Icon */}
            <li
              className='text-slate-100 hover:text-amber-500 cursor-pointer flex items-center p-1.5 sm:p-2 transition-colors'
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <FaTimes size={14} /> : <FaSearch size={14} />}
            </li>

            {/* Home Link */}
            <Link to='/'>
              <li className='text-slate-100 hover:text-amber-500 transition-colors cursor-pointer tracking-wide px-1'>
                Home
              </li>
            </Link>

            {/* About Link */}
            <Link to='/about'>
              <li className='text-slate-100 hover:text-amber-500 transition-colors cursor-pointer tracking-wide px-1'>
                About
              </li>
            </Link>

            {/* Profile or Sign in Link */}
            <Link to='/profile' className='flex items-center pl-1'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 sm:h-8 sm:w-8 object-cover border-2 border-amber-500/40 hover:border-amber-500 transition-all shadow-md'
                  src={currentUser.avatar}
                  alt='profile'
                  referrerPolicy='no-referrer'
                />
              ) : (
                <li className='text-slate-100 hover:text-amber-500 transition-colors cursor-pointer bg-amber-500/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-amber-500/20 text-[11px] sm:text-xs'>
                  Sign in
                </li>
              )}
            </Link>

          </ul>
        </div>
      </div>

      {/* Dropdown Search Bar */}
      <div
        className={`absolute left-0 w-full bg-[#1e293b]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300 ease-in-out overflow-hidden z-40 ${isSearchOpen ? 'top-full opacity-100 h-16' : 'top-0 opacity-0 h-0 pointer-events-none'
          }`}
      >
        <div className='max-w-6xl mx-auto p-3 flex justify-center h-full items-center'>
          <form onSubmit={handleSubmit} className='bg-slate-900/90 border border-white/10 p-2 rounded-xl flex items-center w-full max-w-lg shadow-xl'>
            <input
              type='text'
              placeholder='Search premium properties...'
              className='bg-transparent focus:outline-none w-full text-white px-2 placeholder-slate-500 text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className='p-1.5 rounded-lg hover:bg-slate-800 transition-colors mr-1'>
              <FaSearch className='text-amber-500' size={14} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}