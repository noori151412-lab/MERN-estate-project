import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('https://mern-estate-project.vercel.app/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings(); 
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('https://mern-estate-project.vercel.app/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('https://mern-estate-project.vercel.app/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div
      className='w-full min-h-screen relative font-sans bg-cover bg-center bg-no-repeat bg-fixed pt-16 overflow-x-hidden'
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className='absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] z-0'></div>
      {/* 🔹 Top Hero Section */}
      <div className='relative z-10 flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto text-center md:text-left'>
        <h1 className='text-slate-100 font-bold text-3xl lg:text-6xl tracking-wide font-serif leading-tight drop-shadow-xl'>
          Unlock the Door to your <br />
          <span className='text-[#C5A059]'>Perfect</span> Lifestyle.
        </h1>
        <div className='text-slate-200 text-xs sm:text-sm max-w-xl font-medium drop-shadow-md'>
          Your premium real estate journey starts here. Vantura Estates connects you to carefully curated spaces where modern luxury meets comfort, making your search effortless.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-[#C5A059] font-bold hover:bg-[#C5A059] hover:text-slate-950 tracking-wider w-fit mx-auto md:mx-0 bg-slate-900/50 border border-[#C5A059]/30 px-5 py-2.5 rounded-xl transition-all duration-300'
        >
          Let's get started...
        </Link>
      </div>

      {/* 🔹 Swiper Slider Section */}
      <div className='relative z-10'>
        <Swiper navigation className='h-125 shadow-2xl border-y border-white/5'>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-125 relative'
                >
                  <div className='absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]'></div>
                  <div className='absolute bottom-10 left-10 z-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-lg shadow-xl'>
                    <h2 className='text-xl font-bold text-[#C5A059] truncate'>{listing.name}</h2>
                    <p className='text-slate-300 text-sm mt-1 line-clamp-2'>{listing.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* 🔹 Categories Grid Sections (Offers, Rent, Sale) */}
      <div className='relative z-10 max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10 px-6 md:px-12'>

        {/* Recent Offers Block */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3 flex justify-between items-end border-b border-white/10 pb-3'>
              <div>
                <h2 className='text-2xl font-semibold text-[#C5A059] font-serif'>Recent Offers</h2>
                <p className='text-sm text-slate-400 mt-1'>Exquisite spaces at discounted rates</p>
              </div>
              <Link className='text-sm text-amber-500 hover:underline font-medium' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-6 justify-center md:justify-start mt-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Rent Properties Block */}
        {rentListings && rentListings.length > 0 && (
          <div className='mt-6'>
            <div className='my-3 flex justify-between items-end border-b border-white/10 pb-3'>
              <div>
                <h2 className='text-2xl font-semibold text-[#C5A059] font-serif'>Recent Places for Rent</h2>
                <p className='text-sm text-slate-400 mt-1'>Premium spaces curated for comfortable living</p>
              </div>
              <Link className='text-sm text-amber-500 hover:underline font-medium' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-6 justify-center md:justify-start mt-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* Recent Sale Properties Block */}
        {saleListings && saleListings.length > 0 && (
          <div className='mt-6'>
            <div className='my-3 flex justify-between items-end border-b border-white/10 pb-3'>
              <div>
                <h2 className='text-2xl font-semibold text-[#C5A059] font-serif'>Recent Places for Sale</h2>
                <p className='text-sm text-slate-400 mt-1'>Invest in premium properties across premier locations</p>
              </div>
              <Link className='text-sm text-amber-500 hover:underline font-medium' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-6 justify-center md:justify-start mt-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
};