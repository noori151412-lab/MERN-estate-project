import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-3 mt-6 bg-slate-950/40 p-4 rounded-xl border border-white/5'>
          <p className='text-slate-300 text-sm'>
            Contact <span className='font-semibold text-[#C5A059]'>{landlord.username}</span> for{' '}
            <span className='font-semibold text-[#C5A059]'>{listing.name}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full p-3 border border-white/10 bg-slate-900/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 resize-none text-sm'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-[#C5A059] text-slate-950 text-center p-3 uppercase rounded-lg font-bold hover:bg-[#b08e4f] transition-colors text-sm tracking-wider shadow-lg block mt-2'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}