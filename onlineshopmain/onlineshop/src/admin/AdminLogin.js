import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  });

  const adminInput = (e) => {
    let loginData = {...adminData};
    loginData[e.target.name] = e.target.value
    setAdminData(loginData);
  }

  const loginAdmin = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/token/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.access) {
        localStorage.setItem('admin-token', data.access);
        navigate('/admin/dashboard')
      }else{
        alert('username or password is wrong!')
      }
    })
    .catch(err => alert(err))
  }

  return (
    <div className='container m-auto py-52'>
      <div className='w-full flex flex-wrap bg-white dark:bg-[var(--dark-bg)] rounded-xl shadow-xl overflow-hidden'>
        <div className='flex-1 basis-96'>
            <img className='w-full h-full object-cover' src='/images/adminDarkLogin.jpeg' alt='login-images'/>
        </div>
        <div className='w-full p-8 flex-1 basis-96'>
          <h1 className='text-2xl dark:text-white font-semibold'>Login</h1>
          <form onSubmit={loginAdmin} className='w-full mt-6'>
            <label className='block text-gray-700 dark:text-gray-400' htmlFor='admin-email'>Email</label>
            <input onChange={adminInput}
              name='email'
              className='w-full mt-2 bg-[#f4f5f7] dark:bg-[#24262d] border dark:border-none px-3 placeholder:text-[#6d6f72] dark:text-gray-400 py-3 rounded-md placeholder:text-sm focus:outline-none focus:-translate-y-1 focus:shadow-lg transition-all duration-150 ease-in-out'
              placeholder='email'
              type='email'
              id='admin-email' required/>
            {/* password */}
            <label className='block mt-4 text-gray-700 dark:text-gray-400' htmlFor='admin-password'>Password</label>
            <input onChange={adminInput}
              name='password'
              className='w-full mt-2 bg-[#f4f5f7] dark:bg-[#24262d] border dark:border-none px-3 placeholder:text-[#6d6f72] dark:text-gray-400 py-3 rounded-md placeholder:text-sm focus:outline-none focus:-translate-y-1 focus:shadow-lg transition-all duration-150 ease-in-out'
              placeholder='password'
              type='password'
              id='admin-password' required/>

            <div className='w-full flex justify-end mt-10'>
              <input
                className='bg-[var(--admin-base)] px-5 py-2 rounded-lg text-white cursor-pointer'
                type='submit'
                value='Login'/>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
