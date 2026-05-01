import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';

const AdminDetail = () => {
  const navigate = useNavigate();
  const [adminDetail, setAdminDetail] = useState([]);
  const [showfilename, setshowfilename] = useState(false);
  const [filename, setfilename] = useState("");
  const [updateImage, setUpdateImage] = useState({});
  const base_url = "http://127.0.0.1:8000";

  // user detail fetch function
  const fetchadmindetail = useCallback(() => {
    const bearer = localStorage.getItem('admin-token');

    if(!bearer) {
      navigate('/admin');
      return;
    }

    // fetch admin detail
    fetch("http://127.0.0.1:8000/api/userdetail/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      }
    })
    .then(resp => {
      if(resp.status === 401) {
        localStorage.removeItem('admin-token');
        navigate('/admin')
      }
      return resp.json();
    })
    .then(data => setAdminDetail(data))
    .catch(error => console.error(error))
  }, [navigate])

  useEffect(() => {
    fetchadmindetail();
  }, [fetchadmindetail]);

  // show file name
  const fileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      setUpdateImage({
        picturePreview : URL.createObjectURL(file),
        pictureAsFile : file
      })
      let filename = file.name;
      let filesize = (file.size / 1000).toFixed(2);
      let filedata = `${filename} - ${filesize}KB`;
      setfilename(filedata);
      setTimeout(() => {
        setshowfilename(true);
      }, 300)
    }
  }

  // update profile
  const updateProfile = (e) => {
    e.preventDefault();

    const bearer = localStorage.getItem('admin-token');
    const formData = new FormData();
    formData.append("user_profile", updateImage.pictureAsFile);

    fetch("http://127.0.0.1:8000/api/userupdate/", {
      method: "PUT",
      headers: {
          'Authorization': `Bearer ${bearer}`
      },
      body: formData,
    })
    .then((resp) => {
      if(resp.status === 200) return resp.json();
      if(resp.status === 401) {
        localStorage.removeItem('admin-token');
        navigate('/admin');
      }
    })
    .then(() => {
      fetchadmindetail();
      setshowfilename(false);
      setfilename("");
      toast.success("Profile successfully updated!")
    })
    .catch((error) => console.error(error));
  }

  return (
    <div className='w-full container m-auto h-svh pb-12 md:pl-64 md:mt-16 mt-12 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-[#121317]'>
      <ToastContainer position='top-center' autoClose={3000}/>
      <div className='flex flex-col gap-7 justify-center items-center'>

        {/* admin profile */}
        <img className='userprofile w-[22rem] aspect-square object-cover rounded-full border-gray-400 border-[2px] shadow-xl'
          src={`${base_url + adminDetail.user_profile}`} alt={adminDetail.name} />

        {/* admin name */}
        <h2 className="md:text-4xl text-3xl uppercase font-serif font-semibold">
          {adminDetail.name}
        </h2>

        {/* admin email */}
        <h2 className="md:text-4xl text-3xl uppercase font-serif font-semibold">
          {adminDetail.email}
        </h2>
      </div>

      <div className='w-full flex justify-center mt-12'>
        {/* update admin profile */}
        <form onSubmit={updateProfile} className={`flex justify-center items-center gap-3 py-1 px-[15px]
              ${showfilename ? 'border-gray-500 border-[1.5px]' : 'border-0'} rounded-2xl transition-all duration-500 ease-in-out`}>

            {/* update logo */}
            <label htmlFor="upload_image" className={`${showfilename ? 'bg-[var(--btn-color)]' : 'bg-[var(--admin-base)]'} flex justify-center items-center h-full
                        aspect-square rounded-2xl hover:scale-[1.03] hover:shadow-md transition-all duration-200 ease-in-out`}>
                <i className='bx bx-image-add text-3xl text-[var(--bg-color)] aspect-square'></i>
            </label>

            {/* update btn */}
            <input type='file'
                onChange={fileChange}
                className='hidden'
                id="upload_image" required />
            <div className={`${showfilename ? 'max-w-[400px] opacity-100' : 'max-w-0 opacity-0'}
                        flex items-center gap-0 transition-all duration-500 ease-in-out`}>

                {/* file name */}
                <input type='text'
                    value={filename}
                    id='file_text'
                    className={`bg-transparent h-full focus:outline-none group-focus:inline-block
                        ${showfilename ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}`} readOnly placeholder='' />

                {/* file update btn */}
                <input type='submit'
                    id='submit-btn'
                    value='Upload'
                    accept='image/*'
                    name='user_profile'
                    className={`cursor-pointer font-medium text-[17px] py-[0.8em] pr-[1.5em] pl-[1.2em]
                ${showfilename ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
                text-white bg-[#ad5389] border-none tracking-tighter rounded-[1em] bg-[linear-gradient(0deg,rgba(77,54,208,1)0%,rgba(132,116,254,1)100%)]
                shadow-[0_0.7em_1.5em_-0.5em_#4d36d0be] hover:shadow-[0_0.5em_1.5em_-0.5em_#4d36d0be] active:shadow-[0_0.3em_1em_-0.5em_#4d36d0be]`} />
            </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDetail
