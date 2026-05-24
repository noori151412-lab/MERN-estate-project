import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log("Typing Data:", { ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final Data for Backend:", formData);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      console.log("Backend Response:", data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log("Submission Error:", error.message);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='p-3 min-h-screen flex flex-col justify-center relative'>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className='relative z-10 w-full flex flex-col items-center py-10'>

        {/* Branding */}
        <div className='text-center mb-10'>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
            <span className='text-white'>VANTURA</span> <span className='text-[#C5A059]'>ESTATES</span>
          </h1>
          <p className='text-slate-300 mt-2 italic text-sm'>Where Dreams Find a Home</p>
        </div>

        {/* Unique Dark Theme Card */}
        <div className='bg-[#0F172A]/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#C5A059]/30 max-w-lg w-full'>
          <h2 className='text-2xl font-semibold text-white mb-8 text-center border-b border-[#C5A059]/20 pb-4'>
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-left'>
            {/* USERNAME */}
            <div className='flex flex-col gap-1'>
              <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
                Username
              </label>
              <input
                type='text'
                placeholder='Enter your name'
                className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full'
                id='username'
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className='flex flex-col gap-1'>
              <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
                Email Address
              </label>
              <input
                type='email'
                placeholder='name@example.com'
                className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full'
                id='email'
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD WITH EYE ICON */}
            <div className='flex flex-col gap-1'>
              <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='password'
                  className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full pr-12'
                  id='password'
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-amber-500 z-10'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              className='bg-[#C5A059] text-white rounded-lg p-3 uppercase font-bold hover:opacity-90 disabled:opacity-80 transition-opacity shadow-lg mt-4'
            >
              {loading ? 'Loading...' : 'Join the Elite'}
            </button>
            {/* --- Adjusted OR Divider --- */}
            <div className='flex items-center'>
              <div className='flex-1 border-t border-slate-700/50'></div>
              <span className='px-3 text-[10px] font-bold text-white uppercase tracking-[0.2em]'>
                OR
              </span>
              <div className='flex-1 border-t border-slate-700/50'></div>
            </div>

            <OAuth />
          </form>

          <div className='flex gap-2 mt-8 justify-center border-t border-slate-700 pt-6'>
            <p className='text-slate-400 text-sm'>Already have an account?</p>
            <Link to={'/sign-in'}>
              <span className='text-[#C5A059] font-bold hover:underline text-sm'>Sign In</span>
            </Link>
          </div>

          {error && <p className='text-red-400 mt-5 text-center text-sm font-medium'>{error}</p>}
        </div>
      </div>
    </div>
  );
}