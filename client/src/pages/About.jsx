import React from 'react';

export default function About() {
  return (
    <div
      className='w-full min-h-screen relative font-sans bg-cover bg-center bg-no-repeat bg-fixed pt-24 pb-12 overflow-x-hidden'
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')` }}
    >
      {/* 🔹 Glassmorphic Dark Overlay */}
      <div className='absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0'></div>

      <div className='relative z-10 max-w-4xl mx-auto px-6 text-center md:text-left text-white flex flex-col gap-8'>

        {/* Main Title */}
        <h1 className='text-3xl sm:text-5xl font-bold font-serif text-slate-100 tracking-wide leading-tight text-center'>
          About <span className='text-[#C5A059]'>Vantura Estates</span>
        </h1>

        {/* Introduction Card */}
        <div className='bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-[#C5A059]/20 shadow-xl flex flex-col gap-4 mt-4'>
          <p className='text-slate-300 text-sm sm:text-base leading-relaxed'>
            Welcome to <span className='text-[#C5A059] font-semibold'>Vantura Estates</span>, your premier destination for high-end luxury real estate. We specialize in connecting discerning clients with exquisite living spaces that perfectly complement their sophisticated lifestyles. Whether you are looking to invest in a masterpiece property or find a premium rental, we make the entire journey effortless.
          </p>
          <p className='text-slate-300 text-sm sm:text-base leading-relaxed'>
            Our mission is simple: to redefine the real estate experience by merging timeless elegance with modern digital convenience. We believe that finding your next perfect place should not just be a transaction, but a completely seamless and rewarding journey.
          </p>
        </div>

        {/* Why Choose Us Grid */}
        <div className='mt-4'>
          <h2 className='text-2xl font-semibold font-serif text-[#C5A059] text-center mb-6'>Why Choose Vantura Estates?</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-left'>

            <div className='bg-slate-950/50 backdrop-blur-md border border-white/5 p-5 rounded-xl hover:border-[#C5A059]/40 transition-all duration-300'>
              <h3 className='text-slate-100 font-semibold mb-2 font-serif'>Curated Listings</h3>
              <p className='text-slate-400 text-xs sm:text-sm leading-relaxed'>Every single property in our catalog is handpicked to guarantee absolute luxury, comfort, and prime positioning.</p>
            </div>

            <div className='bg-slate-950/50 backdrop-blur-md border border-white/5 p-5 rounded-xl hover:border-[#C5A059]/40 transition-all duration-300'>
              <h3 className='text-slate-100 font-semibold mb-2 font-serif'>Seamless Experience</h3>
              <p className='text-slate-400 text-xs sm:text-sm leading-relaxed'>From advanced predictive searches to direct agent communication, our platform is tailored for maximum ease.</p>
            </div>

            <div className='bg-slate-950/50 backdrop-blur-md border border-white/5 p-5 rounded-xl hover:border-[#C5A059]/40 transition-all duration-300'>
              <h3 className='text-slate-100 font-semibold mb-2 font-serif'>Unmatched Expertise</h3>
              <p className='text-slate-400 text-xs sm:text-sm leading-relaxed'>Our team provides deep market insights and robust legal frameworks to make sure your investments are secure.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}