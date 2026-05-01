import { Outlet } from 'react-router-dom'
import AdminNavbar from './admincomponents/AdminNavbar'
import { useEffect, useState } from 'react'
import { AdminSearchProvider } from './admincomponents/AdminSearch';

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('admin-dark-mode') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('admin-dark-mode', darkMode);
  },[darkMode]);
  return (
    <AdminSearchProvider>
      <div className='bg-gray-50 dark:bg-[#121317] text-gray-900 dark:text-gray-900'>
        <AdminNavbar toggleDark={() => setDarkMode(!darkMode)} isDark={darkMode}/>
        <Outlet/>
      </div>
    </AdminSearchProvider>
  )
}

export default AdminLayout
