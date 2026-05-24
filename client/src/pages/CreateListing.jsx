import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    // --- MULTIPLE IMAGES UPLOAD HANDLER ---
    const handleImageSubmit = async (e) => {
        e.preventDefault();
        if (files.length > 0 && files.length + (formData.imageUrls?.length || 0) < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            try {
                const urls = await Promise.all(promises);
                setFormData({
                    ...formData,
                    imageUrls: (formData.imageUrls || []).concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            } catch (err) {
                setImageUploadError('Image upload failed (max 2 mb per image)');
                setUploading(false);
            }
        } else {
            setImageUploadError('You can only upload up to 6 images per listing');
            setUploading(false);
        }
    };

    // --- SINGLE IMAGE UPLOAD TO CLOUDINARY ---
    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'mern-estate');
            data.append('cloud_name', 'dqgwrl8km');

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dqgwrl8km/image/upload', {
                    method: 'POST',
                    body: data,
                });
                const uploadedImageData = await res.json();
                if (uploadedImageData.secure_url) {
                    resolve(uploadedImageData.secure_url);
                } else {
                    reject(uploadedImageData);
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    // --- REMOVE UPLOADED IMAGE FUNCTION ---
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    // --- MAIN SUBMIT TO DATABASE HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');

            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }

            navigate(`/listing/${data._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='w-full min-h-screen bg-linear-to-br from-[#f0ce85] via-[#0F172A] to-[#645a36] flex flex-col items-center justify-center p-4 animate-fade-in pb-16'>
            <div className='p-3 max-w-4xl mx-auto w-full'>
                <h1 className='text-3xl font-extrabold text-center my-7 text-[#e09b1cf0] tracking-wide uppercase'>
                    Create a Listing
                </h1>

                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6 bg-[#0F172A]/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl'>

                    {/* LEFT SIDE: DETAILS FORM */}
                    <div className='flex flex-col gap-4 flex-1'>
                        <input
                            type='text'
                            placeholder='Name'
                            className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all'
                            id='name'
                            maxLength='62'
                            minLength='10'
                            required
                            onChange={handleChange}
                            value={formData.name || ''}
                        />
                        <textarea
                            placeholder='Description'
                            className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all min-h-25'
                            id='description'
                            required
                            onChange={handleChange}
                            value={formData.description || ''}
                        />
                        <input
                            type='text'
                            placeholder='Address'
                            className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-white transition-all'
                            id='address'
                            required
                            onChange={handleChange}
                            value={formData.address || ''}
                        />

                        {/* CHECKBOXES */}
                        <div className='flex gap-6 flex-wrap mt-2'>
                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' id='sale' className='w-5 h-5 accent-[#C5A059] cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.type === 'sale'}
                                />
                                <span className='text-sm text-slate-300 font-medium'>Sell</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' id='rent' className='w-5 h-5 accent-[#C5A059] cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.type === 'rent'} />
                                <span className='text-sm text-slate-300 font-medium'>Rent</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' id='parking' className='w-5 h-5 accent-[#C5A059] cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.parking} />
                                <span className='text-sm text-slate-300 font-medium'>Parking spot</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' id='furnished' className='w-5 h-5 accent-[#C5A059] cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.furnished} />
                                <span className='text-sm text-slate-300 font-medium'>Furnished</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' id='offer' className='w-5 h-5 accent-[#C5A059] cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.offer} />
                                <span className='text-sm text-slate-300 font-medium'>Offer</span>
                            </div>
                        </div>

                        {/* BEDS, BATHS & PRICE */}
                        <div className='flex flex-wrap gap-6 mt-2'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='bedrooms'
                                    min='1'
                                    max='10'
                                    required
                                    className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none text-white w-20 text-center'
                                    onChange={handleChange}
                                    value={formData.bedrooms} />
                                <p className='text-sm text-slate-300 font-medium'>Beds</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='bathrooms'
                                    min='1'
                                    max='10'
                                    required
                                    className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none text-white w-20 text-center'
                                    onChange={handleChange}
                                    value={formData.bathrooms} />
                                <p className='text-sm text-slate-300 font-medium'>Baths</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='regularPrice'
                                    min='50'
                                    max='10000000'
                                    required
                                    className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none text-white w-32 text-center'
                                    onChange={handleChange}
                                    value={formData.regularPrice} />

                                <div className='flex flex-col items-center'>
                                    <p className='text-sm text-slate-300 font-medium'>Regular price</p>
                                    <span className='text-[10px] text-slate-500'>($ / month)</span>
                                </div>
                            </div>
                            {formData.offer && (
                                <div className='flex items-center gap-2 animate-fade-in'>
                                    <input
                                        type='number'
                                        id='discountPrice'
                                        min='0'
                                        max='10000000'
                                        required
                                        className='bg-[#1E293B]/50 border border-slate-600 p-3 rounded-xl focus:outline-none text-white w-32 text-center'
                                        onChange={handleChange}
                                        value={formData.discountPrice}
                                    />
                                    <div className='flex flex-col items-center'>
                                        <p className='text-sm text-slate-300 font-medium'>Discounted price</p>
                                        <span className='text-[10px] text-slate-500'>($ / month)</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: IMAGES UPLOAD & SUBMIT */}
                    <div className='flex flex-col flex-1 gap-4'>
                        <p className='font-semibold text-white text-sm'>
                            Images:
                            <span className='font-normal text-slate-400 ml-2 text-xs'>
                                The first image will be the cover (max 6)
                            </span>
                        </p>

                        <div className='flex gap-4'>
                            <input
                                onChange={(e) => setFiles(e.target.files)}
                                className='p-3 border border-slate-600 rounded-xl w-full text-slate-400 bg-[#1E293B]/50'
                                type='file'
                                id='images'
                                accept='image/*'
                                multiple
                            />
                            <button
                                type='button'
                                disabled={uploading}
                                onClick={handleImageSubmit}
                                className='p-3 text-[#C5A059] border border-[#C5A059] rounded-xl uppercase hover:bg-[#C5A059] hover:text-slate-900 transition-all font-bold disabled:opacity-80 active:scale-95 shadow-lg'
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>

                        {/* IMAGE UPLOAD ERROR DISPLAY */}
                        {imageUploadError && (
                            <p className='text-red-400 text-sm font-semibold bg-red-500/10 p-2 rounded-lg border border-red-500/20'>
                                {imageUploadError}
                            </p>
                        )}

                        {/* DISPLAY UPLOADED IMAGES PREVIEWS */}
                        {formData.imageUrls && formData.imageUrls.length > 0 && (
                            <div className='flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 border border-slate-800 p-2 rounded-xl bg-slate-950/20'>
                                {formData.imageUrls.map((url, index) => (
                                    <div key={url} className='flex justify-between p-3 border border-slate-700/50 items-center bg-[#1E293B]/30 rounded-xl'>
                                        <img src={url} alt='listing' className='w-20 h-20 object-cover rounded-lg border border-slate-600 shadow-md' />
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveImage(index)}
                                            className='p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm font-bold uppercase transition-all'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* MAIN CREATE LISTING BUTTON */}
                        <button
                            disabled={loading || uploading}
                            className='p-3 bg-[#C5A059] text-slate-900 font-extrabold uppercase rounded-xl hover:bg-[#b38f4d] active:scale-[0.98] transition-all shadow-xl tracking-wider text-md mt-2 disabled:opacity-50'
                        >
                            {loading ? 'Creating...' : 'Create Listing'}
                        </button>

                        {/* DATABASE GLOBAL ERROR DISPLAY */}
                        {error && (
                            <p className='text-red-400 text-sm font-semibold bg-red-500/10 p-2 rounded-lg border border-red-500/20 text-center'>
                                {error}
                            </p>
                        )}
                    </div>

                </form>
            </div>
        </main>
    );
}