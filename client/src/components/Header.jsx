import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const messages = [
    { text: "Your Gateway to Luxury —", color: "text-amber-500/80", italic: true },
    { text: "Exquisite Living Spaces —", color: "text-slate-100", italic: false },
    { text: "Premium Real Estate —", color: "text-amber-500/80", italic: true },
  ];

  return (
    <header className='bg-slate-900 shadow-md relative'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

        {/* Left Side: Logo and Brand Name */}
        <Link to='/'>
          <div className='flex items-center gap-2 hover:opacity-90 transition-opacity'>
            <img
              src="/favicon.png"
              alt="Vantura Estates Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-100'>Vantura</span>
              <span className='text-amber-500'>Estates</span>
            </h1>
          </div>
        </Link>
       {/* Center: Animated Slogan */}
<div className='flex flex-1 overflow-hidden mx-2 sm:mx-10 relative items-center'>
  <div className='flex whitespace-nowrap animate-marquee-infinite'> 
    {/* Group 1 */}
    <div className='flex shrink-0 items-center'>
      {messages.map((msg, index) => (
        <p 
          key={index} 
          className={`${msg.color} ${msg.italic ? 'italic' : ''} font-serif tracking-widest text-[10px] sm:text-xs uppercase py-1 px-4 sm:px-10 border-l border-amber-500/30`}
        >
          {msg.text}
        </p>
      ))}
    </div>

    {/* Group 2 (Exact Duplicate for Seamless Loop) */}
    <div className='flex shrink-0 items-center'>
      {messages.map((msg, index) => (
        <p 
          key={index} 
          className={`${msg.color} ${msg.italic ? 'italic' : ''} font-serif tracking-widest text-[10px] sm:text-xs uppercase py-1 px-4 sm:px-10 border-l border-amber-500/30`}
        >
          {msg.text}
        </p>
      ))}
    </div>

  </div>
</div>
       
        {/* Right Side: Navigation & Search Icon */}
        <div className='flex items-center gap-4'>
          <ul className='flex gap-4 items-center'>

            {/* 1. Search Icon */}
            <li
              className='text-slate-100 hover:text-amber-500 cursor-pointer flex items-center px-2'
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <FaTimes size={18} /> : <FaSearch size={18} />}
            </li>

            {/* 2. Home Link */}
            <Link to='/'>
              <li className='hidden sm:inline text-slate-100 hover:text-amber-500 transition-colors cursor-pointer'>
                Home
              </li>
            </Link>

            {/* 3. About Link */}
            <Link to='/about'>
              <li className='hidden sm:inline text-slate-100 hover:text-amber-500 transition-colors cursor-pointer'>
                About
              </li>
            </Link>

            {/* 4. Sign in Link */}
            <Link to='/sign-in'>
              <li className='text-slate-100 hover:text-amber-500 transition-colors cursor-pointer'>
                Sign in
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {/* Dropdown Search Bar */}
      <div className={`absolute left-0 w-full bg-slate-800 transition-all duration-300 overflow-hidden z-10 ${isSearchOpen ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
        <div className='max-w-6xl mx-auto p-3 flex justify-center'>
          <form className='bg-slate-200 p-2 rounded-lg flex items-center w-full max-w-lg shadow-inner'>
            <input
              type='text'
              placeholder='Search properties...'
              className='bg-transparent focus:outline-none w-full text-slate-800 px-2'
            />
            <button type="submit">
              <FaSearch className='text-slate-600 hover:text-amber-600 transition-colors' />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}