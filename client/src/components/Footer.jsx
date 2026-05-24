import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='bg-slate-950 text-slate-400 border-t border-white/5 py-8 mt-auto relative z-10 font-sans'>
            <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left'>

                {/* Left: Brand Name & Copyright */}
                <div>
                    <h2 className='font-serif font-bold text-lg text-slate-100 tracking-wide'>
                        Vantura <span className='text-[#C5A059]'>Estates</span>
                    </h2>
                    <p className='text-xs text-slate-500 mt-1'>
                        &copy; {new Date().getFullYear()} Vantura Estates. All rights reserved.
                    </p>
                </div>

                {/* Right: Quick Links including your Help Button */}
                <div className='flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-medium tracking-wide'>

                    <Link to='/about' className='hover:text-[#C5A059] transition-colors'>
                        About Us
                    </Link>
                    <Link
                        to='/help'
                        className='text-[#C5A059] font-semibold border-b border-[#C5A059]/30 hover:border-[#C5A059] pb-0.5 transition-all'
                    >
                        Help & FAQs
                    </Link>
                </div>

            </div>
        </footer>
    );
}