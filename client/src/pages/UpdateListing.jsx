import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams(); 
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

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };

        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'mern-estate');
            data.append('cloud_name', 'dqgwrl8km');

            fetch('https://api.cloudinary.com/v1_1/dqgwrl8km/image/upload', {
                method: 'POST',
                body: data,
            })
                .then((res) => res.json())
                .then((uploadedData) => {
                    if (uploadedData.secure_url) {
                        resolve(uploadedData.secure_url);
                    } else {
                        reject('Upload failed');
                    }
                })
                .catch((error) => reject(error));
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({ ...formData, type: e.target.id });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');

            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
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

    const bgUrl = "https://t3.ftcdn.net/jpg/06/42/48/14/360_F_642481448_VLKxlVjveKlPyuvAWDkrRrGiQtjG45Co.jpg";

    return (
        <main
            className='p-3 min-h-screen flex flex-col items-center justify-center bg-fixed'
            style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className='max-w-4xl w-full bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 my-10'>
                <h1 className='text-3xl font-semibold text-center my-7 text-[#C5A059] uppercase tracking-wide'>
                    Update a Listing
                </h1>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6 text-left'>
                    {/* Inputs Section */}
                    <div className='flex flex-col gap-4 flex-1'>
                        <input
                            type='text' placeholder='Name' className='border p-3 rounded-lg bg-white/10 text-white border-white/20' id='name' required maxLength='62' minLength='10'
                            onChange={handleChange} value={formData.name}
                        />
                        <textarea
                            placeholder='Description' className='border p-3 rounded-lg bg-white/10 text-white border-white/20' id='description' required
                            onChange={handleChange} value={formData.description}
                        />
                        <input
                            type='text' placeholder='Address' className='border p-3 rounded-lg bg-white/10 text-white border-white/20' id='address' required
                            onChange={handleChange} value={formData.address}
                        />

                        {/* Checkboxes */}
                        <div className='flex gap-6 flex-wrap mt-2'>
                            <div className='flex gap-2 text-white font-medium'>
                                <input type='checkbox' id='sale' className='w-5 accent-[#C5A059]' onChange={handleChange} checked={formData.type === 'sale'} />
                                <span>Sell</span>
                            </div>
                            <div className='flex gap-2 text-white font-medium'>
                                <input type='checkbox' id='rent' className='w-5 accent-[#C5A059]' onChange={handleChange} checked={formData.type === 'rent'} />
                                <span>Rent</span>
                            </div>
                            <div className='flex gap-2 text-white font-medium'>
                                <input type='checkbox' id='parking' className='w-5 accent-[#C5A059]' onChange={handleChange} checked={formData.parking} />
                                <span>Parking spot</span>
                            </div>
                            <div className='flex gap-2 text-white font-medium'>
                                <input type='checkbox' id='furnished' className='w-5 accent-[#C5A059]' onChange={handleChange} checked={formData.furnished} />
                                <span>Furnished</span>
                            </div>
                            <div className='flex gap-2 text-white font-medium'>
                                <input type='checkbox' id='offer' className='w-5 accent-[#C5A059]' onChange={handleChange} checked={formData.offer} />
                                <span>Offer</span>
                            </div>
                        </div>

                        {/* Numeric Inputs */}
                        <div className='flex flex-wrap gap-6 mt-2 text-white'>
                            <div className='flex items-center gap-2'>
                                <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-white/20 bg-white/10 rounded-lg focus:outline-none w-20' onChange={handleChange} value={formData.bedrooms} />
                                <p className='font-medium text-sm text-slate-300'>Beds</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-white/20 bg-white/10 rounded-lg focus:outline-none w-20' onChange={handleChange} value={formData.bathrooms} />
                                <p className='font-medium text-sm text-slate-300'>Baths</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='number' id='regularPrice' min='50' max='1000000' required className='p-3 border border-white/20 bg-white/10 rounded-lg focus:outline-none w-24' onChange={handleChange} value={formData.regularPrice} />
                                <div className='flex flex-col items-start'>
                                    <p className='font-medium text-sm text-slate-300'>Regular price</p>
                                    {formData.type === 'rent' && <span className='text-xs text-slate-400'>($ / month)</span>}
                                </div>
                            </div>
                            {formData.offer && (
                                <div className='flex items-center gap-2'>
                                    <input type='number' id='discountPrice' min='0' max='1000000' required className='p-3 border border-white/20 bg-white/10 rounded-lg focus:outline-none w-24' onChange={handleChange} value={formData.discountPrice} />
                                    <div className='flex flex-col items-start'>
                                        <p className='font-medium text-sm text-slate-300'>Discounted price</p>
                                        {formData.type === 'rent' && <span className='text-xs text-slate-400'>($ / month)</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right/Images Side */}
                    <div className='flex flex-col flex-1 gap-4'>
                        <p className='font-semibold text-white text-sm'>
                            Images: <span className='font-normal text-slate-400 ml-1'>The first image will be the cover (max 6)</span>
                        </p>
                        <div className='flex gap-4'>
                            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-white/20 rounded w-full text-slate-400 bg-white/5' type='file' id='images' accept='image/*' multiple />
                            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-sm text-[#C5A059] border border-[#C5A059] font-bold rounded hover:bg-[#C5A059] hover:text-slate-900 transition-all uppercase tracking-wider disabled:opacity-80'>
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                        <p className='text-red-400 text-xs font-medium'>{imageUploadError && imageUploadError}</p>

                        {formData.imageUrls.length > 0 &&
                            formData.imageUrls.map((url, index) => (
                                <div key={url} className='flex justify-between p-3 border border-white/10 items-center bg-slate-950/40 rounded-xl'>
                                    <img src={url} alt='listing image' className='w-20 h-20 object-cover rounded-lg' />
                                    <button type='button' onClick={() => handleRemoveImage(index)} className='p-2 text-red-400 font-bold bg-red-500/10 rounded-lg hover:bg-red-500/20 text-xs uppercase transition-all'>
                                        Delete
                                    </button>
                                </div>
                            ))}

                        <button disabled={loading || uploading} className='p-3 bg-[#C5A059] text-white rounded-lg uppercase font-bold hover:opacity-95 disabled:opacity-80 transition-opacity tracking-wider mt-4 shadow-lg w-full'>
                            {loading ? 'Updating...' : 'Update listing'}
                        </button>
                        {error && <p className='text-red-400 text-sm font-medium text-center mt-2'>{error}</p>}
                    </div>
                </form>
            </div>
        </main>
    );
}