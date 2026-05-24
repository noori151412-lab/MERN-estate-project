import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { token } = useParams(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match!');
        }

        try {
            setLoading(true);
            setError(null);
            setMessage(null);

            const res = await fetch(`/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }

            setLoading(false);
            setMessage('Password reset successfully! Redirecting to Sign In...');

            setTimeout(() => {
                navigate('/sign-in');
            }, 3000);

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto min-h-screen flex flex-col justify-center animate-fade-in'>
            <div className='bg-[#0F172A]/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center flex flex-col gap-6'>

                <h1 className='text-3xl font-bold text-[#C5A059] tracking-wide uppercase'>
                    Create New Password
                </h1>
                <p className='text-slate-400 text-sm pl-1 text-left -mb-2'>
                    Please enter your new strong password below.
                </p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-left'>

                    {/* NEW PASSWORD FIELD */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-semibold text-[#C5A059] uppercase tracking-widest ml-1'>
                            New Password
                        </label>
                        <div className='relative w-full'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all placeholder:text-slate-500 w-full pr-12'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-[#C5A059] z-10'
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD FIELD */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-semibold text-[#C5A059] uppercase tracking-widest ml-1'>
                            Confirm Password
                        </label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all placeholder:text-slate-500'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-[#C5A059] z-10'
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <button
                        disabled={loading}
                        className='bg-[#C5A059] text-[#0F172A] p-4 rounded-xl uppercase font-extrabold tracking-widest hover:bg-[#b38f4d] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] active:scale-95 transition-all mt-2'
                    >
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>

                {error && <p className='text-red-500 font-semibold text-sm mt-2'>{error}</p>}
                {message && <p className='text-green-500 font-semibold text-sm mt-2'>{message}</p>}
            </div>
        </div>
    );
}