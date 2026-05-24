import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOutUserStart, signOutUserSuccess, signOutUserFailure
} from '../redux/user/userSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // --- STANDARD BLANK AVATAR FOR DELETION ---
  const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

 
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    setFileUploadError(false);
    setFilePerc(0);

    const minSize = 1.5 * 1024 * 1024; 
    const maxSize = 3 * 1024 * 1024;   

    if (file.size < minSize || file.size > maxSize) {
      setFileUploadError("Please select an image between 1.5 MB and 3 MB!");
      return;
    }

    setFilePerc(10);
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
        setFilePerc(100);
        setFormData({ ...formData, avatar: uploadedImageData.secure_url });
      } else {
        setFileUploadError("Unable to upload image. Please check your internet connection or try a different file.");
      }
    } catch (error) {
      setFileUploadError("Something went wrong on our side. Please check your internet or try again later.");
    }
  };

  // --- NEW FUNCTION TO REMOVE AVATAR AND SET DEFAULT ---
  const handleRemoveAvatar = () => {
    setFilePerc(0);
    setFileUploadError(false);
    setFormData({
      ...formData,
      avatar: defaultAvatar
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `/api/user/listings/${currentUser._id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const bgUrl = "https://t3.ftcdn.net/jpg/06/42/48/14/360_F_642481448_VLKxlVjveKlPyuvAWDkrRrGiQtjG45Co.jpg";

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center p-3 bg-fixed'
      style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className='max-w-lg w-full bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10'>
        <h1 className='text-3xl font-semibold text-center my-7 text-[#C5A059]'>Profile</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-left'>
          <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />

          {/* PROFILE PHOTO AND REMOVE ACTION */}
          <div className="relative self-center mb-2 flex flex-col items-center gap-2">
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className='rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-[#C5A059] shadow-lg hover:scale-105 transition-transform'
            />

            {/* Conditional Remove Button */}
            {(formData.avatar || currentUser.avatar) !== defaultAvatar && (
              <button
                type='button'
                onClick={handleRemoveAvatar}
                className='text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md transition-all uppercase tracking-wider mt-1'
              >
                Remove Photo
              </button>
            )}
          </div>

          <p className='text-sm self-center text-center'>
            {fileUploadError ? (
              <span className='text-red-400 font-medium'>{fileUploadError}</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-300'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-400 font-medium'>Image successfully uploaded!</span>
            ) : ""}
          </p>

          {/* --- USERNAME INPUT --- */}
          <div className='flex flex-col gap-1'>
            <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
              Username
            </label>
            <input
              type="text" placeholder='username' id='username'
              defaultValue={currentUser.username}
              onChange={handleChange}
              className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full'
            />
          </div>

          {/* --- EMAIL INPUT --- */}
          <div className='flex flex-col gap-1'>
            <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
              Email Address
            </label>
            <input
              type="email" placeholder='email' id='email'
              defaultValue={currentUser.email}
              onChange={handleChange}
              className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full'
            />
          </div>

          {/* --- PASSWORD INPUT WITH EYE ICON --- */}
          <div className='flex flex-col gap-1'>
            <label className='text-[#C5A059] text-xs font-bold uppercase tracking-wider pl-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'} placeholder='password' id='password'
                onChange={handleChange}
                className='border p-3 rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full pr-12'
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-amber-500 z-10'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* UPDATE PROFILE BUTTON */}
          <button disabled={loading} className='bg-[#C5A059] text-white rounded-lg p-3 uppercase font-bold hover:opacity-90 disabled:opacity-80 transition-opacity shadow-lg mt-4'>
            {loading ? 'Loading...' : 'Update Profile'}
          </button>

          {/* --- CREATE LISTING BUTTON --- */}
          <Link
            to='/create-listing'
            className='bg-transparent text-[#C5A059] border border-[#C5A059] p-3 rounded-lg uppercase font-bold tracking-wider text-center hover:bg-[#C5A059] hover:text-slate-900 transition-all w-full block mt-2 shadow-lg'
          >
            Create Listing
          </Link>

        </form>

        <div className='flex justify-between mt-6 font-semibold'>
          <span onClick={handleDeleteUser} className='text-red-400 cursor-pointer hover:text-red-300 transition-colors bg-red-900/20 px-3 py-1 rounded-md'>Delete account</span>
          <span onClick={handleSignOut} className='text-red-400 cursor-pointer hover:text-red-300 transition-colors bg-red-900/20 px-3 py-1 rounded-md'>Sign out</span>
        </div>

        <p className='text-red-500 mt-5'>{error ? error : ''}</p>
        <p className='text-green-500 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>

        {/* --- SHOW LISTINGS ACTION BUTTON --- */}
        <button
          onClick={handleShowListings}
          className='text-green-400 font-bold hover:underline w-full mt-6 text-center uppercase tracking-wider text-sm'
        >
          Show Listings
        </button>

        <p className='text-red-400 text-sm font-medium text-center mt-3'>
          {showListingsError ? 'Error showing listings!' : ''}
        </p>

        {/* --- LISTINGS DISPLAY CONTAINER --- */}
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4 mt-6 border-t border-white/10 pt-4">
            <h1 className='text-center text-[#C5A059] text-xl font-bold uppercase tracking-wide mb-2'>Your Listings</h1>
            {userListings.map((listing) => (
              <div key={listing._id} className='border border-white/10 bg-slate-950/40 rounded-xl p-3 flex justify-between items-center gap-4 shadow-md'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-cover rounded-lg border border-white/10' />
                </Link>
                <Link className='text-[#C5A059] font-semibold hover:underline truncate flex-1 text-sm' to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col items-center gap-2'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-400 uppercase text-xs font-bold hover:text-red-300 bg-red-500/10 px-2 py-1 rounded hover:bg-red-500/20 transition-all'
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className='text-green-400 uppercase text-xs font-bold hover:text-green-300 bg-green-500/10 px-2 py-1 rounded hover:bg-green-500/20 transition-all text-center'
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}