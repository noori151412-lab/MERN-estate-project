import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const bgUrl = "https://t3.ftcdn.net/jpg/06/42/48/14/360_F_642481448_VLKxlVjveKlPyuvAWDkrRrGiQtjG45Co.jpg";

  return (
    <main className='min-h-screen text-white pb-10 bg-slate-950'>
      {loading && <p className='text-center my-7 text-2xl text-slate-400 animate-pulse'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl text-red-400'>Something went wrong!</p>}

      {listing && !loading && !error && (
        <div>
          {/* Images Slider Section*/}
          <Swiper navigation className='h-125 border-b border-white/10'>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-full w-full bg-center bg-no-repeat bg-cover'
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className='bg-fixed bg-cover bg-center py-10 px-4 min-h-125'
            style={{ backgroundImage: `url(${bgUrl})` }}
          >
            <div className='flex flex-col max-w-4xl mx-auto p-6 gap-6 bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl'>
              <h1 className='text-3xl font-bold text-[#C5A059] uppercase tracking-wide'>
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </h1>

              <p className='flex items-center gap-2 text-slate-300 text-sm font-medium'>
                <FaMapMarkerAlt className='text-[#C5A059] text-lg' />
                {listing.address}
              </p>

              <div className='flex gap-4'>
                <p className='bg-red-900/60 border border-red-500 text-red-200 text-center p-2 rounded-lg font-semibold uppercase text-xs tracking-wider w-36 shadow-md'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-green-900/60 border border-green-500 text-green-200 text-center p-2 rounded-lg font-semibold uppercase text-xs tracking-wider w-36 shadow-md'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>

              <p className='text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-white/5'>
                <span className='font-semibold text-[#C5A059] block mb-1'>Description:</span>
                {listing.description}
              </p>

              {/* Property Features Icons */}
              <ul className='text-slate-200 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 bg-slate-950/70 p-4 rounded-xl border border-white/5'>
                <li className='flex items-center gap-2 whitespace-nowrap bg-white/5 px-3 py-2 rounded-lg border border-white/5'>
                  <FaBed className='text-[#C5A059] text-lg' />
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds ` : `${listing.bedrooms} Bed `}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap bg-white/5 px-3 py-2 rounded-lg border border-white/5'>
                  <FaBath className='text-[#C5A059] text-lg' />
                  {listing.bathrooms > 1 ? `${listing.bathrooms} Baths ` : `${listing.bathrooms} Bath `}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap bg-white/5 px-3 py-2 rounded-lg border border-white/5'>
                  <FaParking className='text-[#C5A059] text-lg' />
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li className='flex items-center gap-2 whitespace-nowrap bg-white/5 px-3 py-2 rounded-lg border border-white/5'>
                  <FaChair className='text-[#C5A059] text-lg' />
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className='bg-[#C5A059] text-slate-950 text-center p-3 uppercase rounded-lg font-bold hover:bg-[#b08e4f] transition-colors text-sm tracking-wider shadow-lg block w-full mt-6'
                >
                  Contact Landlord
                </button>
              )}
              {contact && <Contact listing={listing} />}
            </div>
          </div>

        </div>
      )}
    </main>
  )
}; 