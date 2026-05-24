import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false); 
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: '',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || '',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false); 

      const queryParams = new URLSearchParams(location.search);
      if (!queryParams.get('type')) {
        queryParams.set('type', 'all');
      }

      const searchQuery = queryParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 5) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  // Centralized Inputs Handler Function
  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  // Update browser URL parameters based on user selections
  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  //  FIXED SHOW MORE CLICK HANDLER
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const urlParams = new URLSearchParams(location.search);

    urlParams.set('startIndex', numberOfListings);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }

    setListings([...listings, ...data]);
  };

  return (
    <div
      className='flex flex-col md:flex-row w-full min-h-screen relative font-sans bg-cover bg-center bg-no-repeat bg-fixed'
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className='absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0'></div>

      {/* 🔹 Left Side: Sidebar Filters */}
      <div className='relative z-10 p-6 md:p-7 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-96 bg-slate-900/60 backdrop-blur-md shadow-2xl shrink-0 md:sticky pt-24 md:pt-28 md:top-24 h-fit rounded-b-2xl md:rounded-b-none'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 md:gap-8'>

          {/* Search Term */}
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-300 text-sm tracking-wide'>Search Term</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search premium spaces...'
              className='border border-white/10 bg-slate-950/60 rounded-xl p-3 w-full focus:outline-none focus:border-amber-500 text-white placeholder-slate-500 text-sm transition-all shadow-inner'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filters */}
          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-slate-300 text-sm tracking-wide'>Type</label>
            <div className='grid grid-cols-2 gap-3 text-sm text-slate-300'>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='all'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.type === 'all'}
                />
                <label htmlFor='all' className='cursor-pointer'>Rent & Sale</label>
              </div>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.type === 'rent'}
                />
                <label htmlFor='rent' className='cursor-pointer'>Rent</label>
              </div>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.type === 'sale'}
                />
                <label htmlFor='sale' className='cursor-pointer'>Sale</label>
              </div>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                <label htmlFor='offer' className='cursor-pointer'>Offer</label>
              </div>
            </div>
          </div>

          {/* Amenities Filters */}
          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-slate-300 text-sm tracking-wide'>Amenities</label>
            <div className='grid grid-cols-2 gap-3 text-sm text-slate-300'>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.parking}
                />
                <label htmlFor='parking' className='cursor-pointer'>Parking</label>
              </div>
              <div className='flex gap-2 items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 accent-amber-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                />
                <label htmlFor='furnished' className='cursor-pointer'>Furnished</label>
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-slate-300 text-sm tracking-wide'>Sort By</label>
            <select
              id='sort_order'
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
              className='border border-white/10 bg-slate-950 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-white text-sm cursor-pointer shadow-md'
            >
              <option value='regularPrice_desc'>Price: High to Low</option>
              <option value='regularPrice_asc'>Price: Low to High</option>
              <option value='createdAt_desc'>Latest Properties</option>
              <option value='createdAt_asc'>Oldest Properties</option>
            </select>
          </div>

          <button className='bg-[#C5A059] text-slate-950 p-3.5 rounded-xl uppercase font-bold hover:bg-[#b08e4f] transition-all text-sm tracking-wider shadow-lg font-sans mt-2 md:mt-4 active:scale-95'>
            Apply Filters
          </button>
        </form>
      </div>

      {/* 🔹 Right Side: Results Grid */}
      <div className='relative z-10 flex-1 p-6 md:p-7 md:px-12 pt-8 md:pt-28 flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold border-b border-white/10 pb-4 text-[#C5A059] tracking-wide font-serif'>
            Listing Results
          </h1>

          <div className='py-6 md:py-8 flex flex-wrap gap-6 justify-center md:justify-start'>
            {loading && (
              <p className='text-xl text-amber-500/80 animate-pulse font-medium tracking-wider w-full text-center py-20'>
                Loading exquisite spaces...
              </p>
            )}

            {!loading && listings.length === 0 && (
              <p className='text-slate-300 text-base italic bg-slate-900/40 backdrop-blur-md px-5 py-3 rounded-xl border border-white/5 inline-block shadow-lg w-full text-center md:text-left'>
                No listings found matching your criteria.
              </p>
            )}

            {!loading && listings && listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        </div>

        {/*PREMIUM SHOW MORE BUTTON UI */}
        {showMore && (
          <div className='w-full text-center pb-10 pt-4'>
            <button
              onClick={onShowMoreClick}
              className='bg-[#C5A059] text-slate-950 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-900/80 hover:text-[#C5A059] hover:border hover:border-[#C5A059]/40 transition-all duration-300 shadow-xl active:scale-95 tracking-wide'
            >
              Show More Premium Spaces
            </button>
          </div>
        )}
      </div>

    </div>
  );
}