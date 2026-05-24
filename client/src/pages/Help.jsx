import React, { useState, useRef } from 'react'; 
import emailjs from '@emailjs/browser'; 

export default function Help() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false); 
  const formRef = useRef(); 

  const faqs = [
    {
      q: "How do I create a property listing?",
      a: "First, sign in to your account. Click on your profile icon in the top right corner, and select 'Create Listing'. Fill in the details, upload images of your property, and click submit."
    },
    {
      q: "Is there a fee to post my property on Vantura Estates?",
      a: "Currently, listing your first 3 properties is completely free. For premium branding and higher visibility, you can contact our luxury management team."
    },
    {
      q: "How can I contact a property dealer or owner?",
      a: "On every single property detail page, there is a built-in secure contact form at the bottom. Once you fill it out, an automated email will connect you directly with the owner."
    },
    {
      q: "Can I edit or delete my listing later?",
      a: "Yes! Go to your Profile page, scroll down to 'Your Listings'. You will find 'Edit' and 'Delete' buttons right next to each of your properties."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

 
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

   
    const SERVICE_ID = 'service_ilcr1jd'; 
    const TEMPLATE_ID = 'template_9wu4bkq'; 
    const PUBLIC_KEY = '7MQZZiOfNp88ixdxl'; 

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          setLoading(false);
          setSuccess(true);
          formRef.current.reset(); 
          setTimeout(() => setSuccess(false), 5000); 
      }, (error) => {
          setLoading(false);
          alert("Something went wrong, please try again.");
          console.log(error.text);
      });
  };

  return (
    <div 
      className='w-full min-h-screen relative font-sans bg-cover bg-center bg-no-repeat bg-fixed pt-24 pb-12 overflow-x-hidden'
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=80')` }}
    >
      {/* 🔹 Dark Glassmorphic Overlay */}
      <div className='absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0'></div>

      <div className='relative z-10 max-w-4xl mx-auto px-6 text-white flex flex-col gap-8'>
        
        {/* Page Title */}
        <div className='text-center flex flex-col gap-2'>
          <h1 className='text-3xl sm:text-5xl font-bold font-serif text-slate-100 tracking-wide'>
            How Can We <span className='text-[#C5A059]'>Help</span> You?
          </h1>
          <p className='text-slate-400 text-sm'>Find quick answers or get in touch with our support team</p>
        </div>

        {/* 🔹 FAQ Accordion Section */}
        <div className='mt-4'>
          <h2 className='text-2xl font-semibold font-serif text-[#C5A059] mb-4 border-b border-white/10 pb-2'>Frequently Asked Questions</h2>
          <div className='flex flex-col gap-3'>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className='bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden transition-all duration-300'
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className='w-full p-5 text-left font-medium flex justify-between items-center text-slate-200 hover:text-[#C5A059] transition-colors focus:outline-none'
                >
                  <span className='font-serif text-sm sm:text-base'>{faq.q}</span>
                  <span className='text-[#C5A059] text-xl font-bold'>{activeFaq === index ? '−' : '+'}</span>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === index ? 'max-h-40 border-t border-white/5 p-5 bg-slate-950/30 text-slate-400 text-xs sm:text-sm' : 'max-h-0'}`}
                >
                  <p className='leading-relaxed'>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Quick Support / Contact Form Section */}
        <div className='bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-[#C5A059]/20 shadow-xl mt-4'>
          <h2 className='text-xl font-semibold font-serif text-[#C5A059] mb-2'>Still need assistance?</h2>
          <p className='text-slate-400 text-xs sm:text-sm mb-6'>Drop your query below and our team will respond within 24 hours.</p>
          
         
          <form ref={formRef} onSubmit={sendEmail} className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <input 
                type="text" 
                name="user_name" 
                placeholder="Your Name" 
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                required
              />
              <input 
                type="email" 
                name="user_email" 
                placeholder="Your Email" 
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                required
              />
            </div>
            <textarea 
              rows="4" 
              name="user_message" 
              placeholder="Describe your issue or question..." 
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
              required
            ></textarea>

            {/* 4. Success Message block */}
            {success && (
              <p className='text-emerald-500 text-xs sm:text-sm font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center'>
                Thank you! Your message has been sent successfully. We will email you back shortly.
              </p>
            )}

            <button 
              type="submit"
              disabled={loading} 
              className="bg-[#C5A059] text-slate-950 font-bold tracking-wider py-3 rounded-xl hover:bg-[#b08e4b] active:scale-98 transition-all text-sm uppercase disabled:opacity-50"
            >
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}