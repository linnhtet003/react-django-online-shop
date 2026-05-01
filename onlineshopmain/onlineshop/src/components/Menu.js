import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MenuList from '../pages/MenuList';
import Contact from '../pages/Contact';
import Story from '../pages/Story';
import Favoristelist from '../pages/Favoristelist';
import OrderDetail from './OrderDetail';
import UserLayout from '../UserLayout'

import AdminLogin from '../admin/AdminLogin'
import AdminLayout from '../AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminOrder from '../admin/AdminOrder';
import AdminReview from '../admin/AdminReview';
import AdminUserlist from '../admin/AdminUserlist';
import AdminProduct from '../admin/AdminProduct';
import AdminCategory from '../admin/AdminCategory';
import AdminPopular from '../admin/AdminPopular';
import AdminProductCreate from '../admin/AdminProductCreate';
import AdminCategoryCreate from '../admin/AdminCategoryCreate';
import AdminDetail from '../admin/AdminDetail';

const Menu = () => {
  return (
    <BrowserRouter>
      <Routes>
      {/* User Layout */}
        <Route element={<UserLayout/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/menu" element={<MenuList/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/story" element={<Story/>} />
          <Route path="/favorite" element={<Favoristelist/>} />
          <Route path="/order" element={<OrderDetail/>} />
        </Route>

      {/* Admin Layout */}
        <Route path='/admin' element={<AdminLayout/>}>
          {/* <Route index element={<AdminDashboard />} /> */}
          <Route index element={<AdminLogin/>} />
          <Route path='dashboard' element={<AdminDashboard/>} />
          <Route path='detail' element={<AdminDetail/>} />
          <Route path='order' element={<AdminOrder/>} />
          <Route path='review' element={<AdminReview/>} />
          <Route path='userlist' element={<AdminUserlist/>} />
          <Route path='product' element={<AdminProduct/>} />
          <Route path='productcreate' element={<AdminProductCreate/>} />
          <Route path='category' element={<AdminCategory/>} />
          <Route path='categorycreate' element={<AdminCategoryCreate/>} />
          <Route path='popular' element={<AdminPopular/>} />
          <Route path='popularcreate' element={<AdminCategoryCreate/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Menu