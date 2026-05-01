import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'boxicons/css/boxicons.min.css';
import { useAdminSearch } from './AdminSearch';

const AdminNavbar = ({ toggleDark, isDark }) => {
  const navigate = useNavigate();
  const base_url = "http://127.0.0.1:8000";
  const [adminDetails, setAdminDetails] = useState([])
  const [sidebar, setSideBar] = useState(false);
  const [profiledd, setProfiledd] = useState(false)
  const [productdd, setProductdd] = useState(false);
  const [categorydd, setCategorydd] = useState(false);
  const [neworpo, setNeworpo] = useState(false);
  const location = useLocation();
  const pathlink = location.pathname
  const [islogin, setLogin] = useState(false);
  const { search, setSearch } = useAdminSearch();

  useEffect(() => {
    const admindetailfetch = () => {
      const bearer = localStorage.getItem('admin-token');
      if (!bearer) {
        navigate('/admin');
        setLogin(false)
        return;
      }
      fetch("http://127.0.0.1:8000/api/userdetail/", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearer}`
        }
      })
        .then(resp => {
          if (resp.status === 401) {
            localStorage.removeItem('admin-token')
            setLogin(false)
            navigate('/admin')
          }
          setLogin(true);
          return resp.json();
        })
        .then(data => setAdminDetails(data))
        .catch(error => console.error(error))
    }
    admindetailfetch();
  }, [navigate])

  const adminLogout = () => {
    localStorage.removeItem("admin-token");
  }


  return (
    <header className={`${islogin ? 'sticky' : 'hidden'} top-0 z-20`}>
      <nav className='flex items-center justify-between h-[4.2rem] px-12 lg:px-14 py-2 shadow-lg bg-white dark:bg-[var(--dark-bg)] dark:shadow-none'>
        {/* logo only full size */}
        <div className='hidden lg:flex'>
          <svg xmlns="http://www.w3.org/2000/svg" width={38} height={38} fill={"var(--admin-base)"} viewBox="0 0 24 24">
            <path d="m7,19.66v1.34c0,.55.45,1,1,1h8c.55,0,1-.45,1-1v-1.34c3.1-1.78,5-5.05,5-8.66,0-.55-.45-1-1-1h0c-.04-1.25-.73-2.38-1.8-3-.25-1.77-1.78-3.13-3.63-3.13-.34,0-.68.05-1.01.14-.68-.65-1.58-1.01-2.55-1.01s-1.87.37-2.55,1.01c-.33-.09-.67-.14-1.01-.14-.01,0-.02,0-.04,0-.01,0-.02,0-.03,0h0c-1.82.04-3.32,1.39-3.56,3.13-1.07.61-1.76,1.74-1.8,3h0c-.55,0-1,.45-1,1,0,3.61,1.9,6.87,5,8.66Zm-.89-11.05l.81-.26-.14-.84c0-.88.73-1.6,1.63-1.62.95.02,1.72.79,1.72,1.75h2c0-.93-.35-1.77-.92-2.43.24-.13.51-.2.79-.2.57,0,1.1.28,1.41.76l.51.77.81-.44c.25-.14.53-.21.82-.21.92,0,1.67.73,1.67,1.62l-.14.84.81.27c.62.21,1.03.76,1.09,1.39H5.02c.05-.63.47-1.19,1.09-1.39Zm13.83,3.39c-.33,2.65-1.94,4.95-4.38,6.16-.34.17-.56.52-.56.9v.94h-6v-.94c0-.38-.21-.73-.56-.9-2.44-1.21-4.06-3.52-4.38-6.16h15.88Z"></path>
          </svg>
          <h1 className='text-2xl self-center text-[var(--text-color)] dark:text-white px-2 font-bold'>Foo<span className='text-[var(--admin-base)]'>die</span></h1>
        </div>
        {/* menu open btn */}
        <div onClick={() => { setSideBar(!sidebar); setProfiledd(false) }} className='flex md:hidden items-center'>
          {sidebar ?
            <i className="bx bx-plus text-3xl text-[var(--admin-base)] cursor-pointer rotate-45" /> :
            <i className="bx bx-menu text-3xl text-[var(--admin-base)] cursor-pointer" />
          }
        </div>
        {/* search */}
        <form className='flex items-center pl-2 bg-[#f4f5f7] dark:bg-[#24262d] rounded-lg overflow-hidden focus-within:border-[var(--admin-base)] focus-within:border-[1px]'>
          <i className='bx bx-search-alt text-xl text-[var(--admin-base)] cursor-pointer'></i>
          <input type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='ml-2 py-2 bg-[#f4f5f7] dark:bg-[#24262d] dark:text-gray-400 focus:outline-none placeholder:text-sm placeholder:text-[#6d6f72]'
            placeholder='Search for Order' />
        </form>
        <div className='flex items-center justify-between'>
          {/* Dark mode */}
          <button className='flex h-full items-center' onClick={toggleDark}>
            {isDark ?
              (
                <i className='bx bx-sun text-[var(--admin-base)] text-2xl'></i>
              ) :
              (
                <i className='bx bxs-moon text-[var(--admin-base)] text-2xl'></i>
              )
            }
          </button>
          {/* profile */}
          <div onClick={() => { setProfiledd(!profiledd); setSideBar(false) }} className='relative h-full ml-6 lg:ml-10 rounded-full cursor-pointer'>
            <img className='w-10 aspect-square object-cover rounded-full' src={`${base_url + adminDetails.user_profile}`} alt='hello' />
          </div>
        </div>
      </nav>

      {/* profile dropdown */}

      <div
        className={`w-32 absolute top-[3.8rem] right-12 lg:right-14 shadow-md bg-white border border-gray-100 dark:border-[#24262de9] dark:bg-[#24262d] cursor-pointer rounded-md z-50 transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: profiledd ? '200px' : '0px',
          opacity: profiledd ? 1 : 0,
          pointerEvents: profiledd ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col gap-2 px-4 py-3 text-sm cursor-pointer">
          <a href="detail" className="flex items-center gap-3 font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out">
            <i className='bx bx-user'></i>Profile
          </a>
          <a href="/admin" onClick={adminLogout} className="flex items-center gap-3 font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out">
            <i className='bx bx-log-out'></i>Logout
          </a>
        </div>
      </div>

      {/* profile backdrop */}
      {profiledd && (
        <div
          className='fixed inset-x-0 bottom-0 top-[4.2rem] z-40'
          onClick={() => setProfiledd(false)}
        />
      )}

      {/* sidebar backdrop */}
      {sidebar && (
        <div
          className='fixed inset-x-0 bottom-0 top-[4.2rem] bg-black bg-opacity-10 z-40'
          onClick={() => setSideBar(false)}
        />
      )}

      {/* sidebar */}
      <aside className={`${sidebar ? 'left-0' : 'left-[-120%]'} w-64 h-full fixed top-[4.2rem] md:left-0 bg-white dark:bg-[var(--dark-bg)] z-50 transition-all duration-300 ease-in-out`}>
        <div className='flex flex-col ml-7'>
          {/* logo */}
          <div className='flex lg:hidden mt-2 mb-6'>
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill={"var(--admin-base)"} viewBox="0 0 24 24">
              <path d="m7,19.66v1.34c0,.55.45,1,1,1h8c.55,0,1-.45,1-1v-1.34c3.1-1.78,5-5.05,5-8.66,0-.55-.45-1-1-1h0c-.04-1.25-.73-2.38-1.8-3-.25-1.77-1.78-3.13-3.63-3.13-.34,0-.68.05-1.01.14-.68-.65-1.58-1.01-2.55-1.01s-1.87.37-2.55,1.01c-.33-.09-.67-.14-1.01-.14-.01,0-.02,0-.04,0-.01,0-.02,0-.03,0h0c-1.82.04-3.32,1.39-3.56,3.13-1.07.61-1.76,1.74-1.8,3h0c-.55,0-1,.45-1,1,0,3.61,1.9,6.87,5,8.66Zm-.89-11.05l.81-.26-.14-.84c0-.88.73-1.6,1.63-1.62.95.02,1.72.79,1.72,1.75h2c0-.93-.35-1.77-.92-2.43.24-.13.51-.2.79-.2.57,0,1.1.28,1.41.76l.51.77.81-.44c.25-.14.53-.21.82-.21.92,0,1.67.73,1.67,1.62l-.14.84.81.27c.62.21,1.03.76,1.09,1.39H5.02c.05-.63.47-1.19,1.09-1.39Zm13.83,3.39c-.33,2.65-1.94,4.95-4.38,6.16-.34.17-.56.52-.56.9v.94h-6v-.94c0-.38-.21-.73-.56-.9-2.44-1.21-4.06-3.52-4.38-6.16h15.88Z"></path>
            </svg>
            <h1 className='text-xl self-center text-[var(--text-color)] dark:text-white px-2 font-bold'>Foo<span className='text-[var(--admin-base)]'>die</span></h1>
          </div>

          {/* dashboard */}
          <div className={`font-medium relative transition-all duration-150 ease-in-out
              ${pathlink === '/admin/dashboard'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'}
            `}>

            {pathlink === '/admin/dashboard' && (
              <span className='absolute inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <a href='dashboard' className='flex items-center gap-3 py-4'>
              <i className='bx bx-home text-xl'></i><span className='text-base'>Dashboard</span>
            </a>
          </div>

          {/* userlist */}
          <div className={`font-medium relative transition-all duration-150 ease-in-out
              ${pathlink === '/admin/userlist'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
            }`}>
            {pathlink === '/admin/userlist' && (
              <span className='absolute inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <a href='userlist' className='flex items-center gap-3 py-4'>
              <i className='bx bx-user text-xl'></i><span className='text-base'>User</span>
            </a>
          </div>

          {/* orderlist */}
          <div className={`font-medium relative transition-all duration-150 ease-in-out
              ${pathlink === '/admin/order'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
            }`}>
            {pathlink === '/admin/order' && (
              <span className='absolute inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <a href='order' className='flex items-center gap-3 py-4'>
              <i className='bx bx-receipt text-xl'></i><span className='text-base'>Order</span>
            </a>
          </div>

          {/* Reviewlist */}
          <div className={`font-medium relative transition-all duration-150 ease-in-out
              ${pathlink === '/admin/review'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
            }`}>
            {pathlink === '/admin/review' && (
              <span className='absolute inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <a href='review' className='flex items-center gap-3 py-4'>
              <i className='bx bx-star text-xl'></i><span className='text-base'>Review</span>
            </a>
          </div>

          {/* product */}
          <div className="font-medium relative">
            {pathlink === '/admin/product' && (
              <span className="absolute h-14 inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg"></span>
            )}

            <button
              onClick={() => { setProductdd(!productdd); setCategorydd(false); setNeworpo(false) }}
              className={`w-full flex items-center justify-between py-4 transition-all duration-150 ease-in-out
                  ${pathlink === '/admin/product'
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
            >
              <div className='flex gap-3 items-center'>
                <i className="bx bx-box text-xl"></i>Product
              </div>
              <i className="bx bx-chevron-down text-2xl mr-5"></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-950 rounded-lg w-[90%]`}
              style={{
                maxHeight: productdd ? '100px' : '0px',
                opacity: productdd ? 1 : 0,
              }}
            >
              <div className="flex flex-col gap-3 px-4 py-3">
                <a href="product" className={`transition-all duration-150 ease-in-out
                  ${pathlink === '/admin/product'
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}>
                  Productlist
                </a>
                <a href="productcreate" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out">
                  Create
                </a>
              </div>
            </div>
          </div>

          {/* category */}
          <div className='font-medium relative'>
            {pathlink === '/admin/category' && (
              <span className='absolute h-14 inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <button onClick={() => { setCategorydd(!categorydd); setProductdd(false); setNeworpo(false) }}
              className={`w-full flex items-center justify-between py-4 transition-all duration-150 ease-in-out
                  ${pathlink === '/admin/category'
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
              <div className='flex gap-3 items-center'>
                <i className='bx bx-category text-xl'></i>Category
              </div>
              <i className='bx bx-chevron-down text-2xl mr-5'></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-950 rounded-lg w-[90%]`}
              style={{
                maxHeight: categorydd ? '100px' : '0px',
                opacity: categorydd ? 1 : 0,
              }}
            >
              <div className="flex flex-col gap-3 px-4 py-3">
                <a href="category" className={`transition-all duration-150 ease-in-out
                  ${pathlink === '/admin/category'
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}>
                  Categorylist
                </a>
                <a href="categorycreate" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out">
                  Create
                </a>
              </div>
            </div>
          </div>

          {/* neworpopular */}
          <div className='font-medium relative'>
            {pathlink === '/admin/popular' && (
              <span className='absolute h-14 inset-y-0 -left-8 w-2 bg-purple-600 rounded-lg'></span>
            )}
            <button onClick={() => { setNeworpo(!neworpo); setProductdd(false); setProductdd(false) }}
              className={`w-full flex items-center justify-between py-4 transition-all duration-150 ease-in-out
                ${pathlink === '/admin/popular'
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
              <div className='flex gap-3 items-center'>
                <i className='bx bx-trending-up text-xl'></i>Trend
              </div>
              <i className='bx bx-chevron-down text-2xl mr-5'></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-950 rounded-lg w-[90%]`}
              style={{
                maxHeight: neworpo ? '100px' : '0px',
                opacity: neworpo ? 1 : 0,
              }}
            >
              <div className="flex flex-col gap-3 px-4 py-3">
                <a href="popular" className={`text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out
                  ${pathlink === '/admin/popular'
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}>
                  Trendlist
                </a>
                <a href="popularcreate" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150 ease-in-out">
                  Create
                </a>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </header>
  )
}

export default AdminNavbar