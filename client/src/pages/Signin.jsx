import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/profile');

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='p-3 min-h-screen flex flex-col justify-center relative'>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')",
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
          <h2 className='text-2xl font-semibold text-[#C5A059] mb-8 text-center border-b border-[#C5A059]/20 pb-4'>Sign In
          </h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-xs font-semibold text-[#C5A059] uppercase tracking-widest ml-1'>Email Address</label>
              <input
                type='email'
                placeholder='name@example.com'
                className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all placeholder:text-slate-500'
                id='email'
                onChange={handleChange}
              />
            </div>
            {/* PASSWORD FIELD WITH FORGOT PASSWORD LINK */}
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center pl-1'>
                <label className='text-xs font-semibold text-[#C5A059] uppercase tracking-widest'>
                  Password
                </label>
                {/* Forgot Password Link */}
                <Link
                  to='/forgot-password'
                  className='text-xs text-slate-400 hover:text-[#C5A059] transition-colors font-medium normal-case'
                >
                  Forgot Password?
                </Link>
              </div>
              <div className='relative w-full'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all placeholder:text-slate-500 w-full pr-12'
                  id='password'
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-[#C5A059] z-10'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              className='bg-[#C5A059] text-[#0F172A] p-4 rounded-xl uppercase font-extrabold tracking-widest hover:bg-[#b38f4d] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] active:scale-95 transition-all mt-4'
            >
              {loading ? 'Processing...' : 'RETURN TO THE ELITE'}
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
            <p className='text-slate-400 text-sm'>Don't have an account?</p>
            <Link to={'/sign-up'}>
              <span className='text-[#C5A059] font-bold hover:underline text-sm'>Sign Up</span>
            </Link>
          </div>

          {error && <p className='text-red-400 mt-5 text-center text-sm font-medium'>{error}</p>}
        </div>
      </div>
    </div>
  );
}