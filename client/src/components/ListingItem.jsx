import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-slate-950/40 backdrop-blur-md border border-[#C5A059]/30 hover:border-[#C5A059] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-82.5 group hover:scale-[1.02] active:scale-98'>
      <Link to={`/listing/${listing._id}`}>
        
        {/* Property Image */}
        <div className='relative overflow-hidden h-80 sm:h-55 w-full'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80'
            }
            alt='listing cover'
            className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out'
          />
          {/* Rent/Sale Badge */}
          <div className='absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-[#C5A059] border border-white/10 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider'>
            For {listing.type}
          </div>
        </div>

        {/* Content Details */}
        <div className='p-5 flex flex-col gap-3 w-full'>
          {/* Title */}
          <p className='truncate text-lg font-semibold text-white tracking-wide group-hover:text-[#C5A059] transition-colors font-serif'>
            {listing.name}
          </p>

          {/* Location */}
          <div className='flex items-center gap-1 text-slate-400 text-sm'>
            <MdLocationOn className='h-4 w-4 text-amber-500 shrink-0' />
            <p className='truncate w-full'>{listing.address}</p>
          </div>

          {/* Description */}
          <p className='text-sm text-slate-400 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>

          {/* Price Tag */}
          <p className='text-[#C5A059] font-bold font-sans text-xl mt-1 flex items-center gap-1'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && <span className='text-xs text-slate-500 font-normal lowercase tracking-normal'> / month</span>}
          </p>

          {/* Beds & Baths Configuration */}
          <div className='text-slate-300 font-semibold text-xs flex items-center gap-4 border-t border-white/5 pt-3 mt-1'>
            <div className='flex items-center gap-1 bg-slate-950/30 px-2 py-1 rounded-md border border-white/5'>
              <span className='text-amber-500'>{listing.bedrooms}</span> {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
            </div>
            <div className='flex items-center gap-1 bg-slate-950/30 px-2 py-1 rounded-md border border-white/5'>
              <span className='text-amber-500'>{listing.bathrooms}</span> {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
            </div>
          </div>
        </div>

      </Link>
    </div>
  );
}