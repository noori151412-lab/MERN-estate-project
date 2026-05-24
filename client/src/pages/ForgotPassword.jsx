import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      
      setLoading(false);
      setMessage(data.message);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='w-full min-h-screen bg-[#0c1431] flex flex-col justify-center items-center p-3 animate-fade-in'>
    <div className='max-w-lg w-full'></div>

<div className='bg-[#0F172A]/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center flex flex-col gap-6'>
        
        <h1 className='text-3xl font-bold text-[#C5A059] tracking-wide uppercase'>
          Reset Your Password
        </h1>
        <p className='text-slate-400 text-sm pl-1 text-left -mb-2'>
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-left'>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-semibold text-[#C5A059] uppercase tracking-widest ml-1'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='name@example.com'
              className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all placeholder:text-slate-500'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className='bg-[#C5A059] text-[#0F172A] p-4 rounded-xl uppercase font-extrabold tracking-widest hover:bg-[#b38f4d] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] active:scale-95 transition-all mt-2'
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        {error && <p className='text-red-500 font-semibold text-sm mt-2'>{error}</p>}
        {message && <p className='text-green-500 font-semibold text-sm mt-2'>{message}</p>}
      </div>
    </div>
  );
}