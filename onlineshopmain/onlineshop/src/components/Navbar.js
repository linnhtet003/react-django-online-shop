import { useEffect, useState } from 'react'
import CartList from './CartList';
import 'boxicons/css/boxicons.min.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartopen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [productNumber, setProductNumber] = useState(0);

  const ChangeProductNumber = () => {
    const cartnumber = JSON.parse(localStorage.getItem("foodie-cart"));
    if(cartnumber){
      setProductNumber(cartnumber.length);
    }else{
      setProductNumber(0);
    }
  }

  useEffect(() => {
    ChangeProductNumber();
    window.addEventListener("CartNumber", ChangeProductNumber);

    return () => window.removeEventListener("CartNumber", ChangeProductNumber)
  },[])

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setUserOpen(false);
  };

  const toggleCart = () => {
    setCartOpen(!cartopen);
    setIsOpen(false);
    setUserOpen(false);
  }

  const userBtn = () => {
    setUserOpen(!userOpen);
    setCartOpen(false);
    setIsOpen(false);
  }

  const logoutBtn = () => {
    localStorage.removeItem("foode-token");
  }


  return (
    <header className='relative'>
      <nav className='max-w-[90%] m-auto py-4 flex items-center justify-between'>
        <div className='flex'>
          <svg  xmlns="http://www.w3.org/2000/svg" width={42} height={42} fill={"#f3c30e"} viewBox="0 0 24 24">
            <path d="m7,19.66v1.34c0,.55.45,1,1,1h8c.55,0,1-.45,1-1v-1.34c3.1-1.78,5-5.05,5-8.66,0-.55-.45-1-1-1h0c-.04-1.25-.73-2.38-1.8-3-.25-1.77-1.78-3.13-3.63-3.13-.34,0-.68.05-1.01.14-.68-.65-1.58-1.01-2.55-1.01s-1.87.37-2.55,1.01c-.33-.09-.67-.14-1.01-.14-.01,0-.02,0-.04,0-.01,0-.02,0-.03,0h0c-1.82.04-3.32,1.39-3.56,3.13-1.07.61-1.76,1.74-1.8,3h0c-.55,0-1,.45-1,1,0,3.61,1.9,6.87,5,8.66Zm-.89-11.05l.81-.26-.14-.84c0-.88.73-1.6,1.63-1.62.95.02,1.72.79,1.72,1.75h2c0-.93-.35-1.77-.92-2.43.24-.13.51-.2.79-.2.57,0,1.1.28,1.41.76l.51.77.81-.44c.25-.14.53-.21.82-.21.92,0,1.67.73,1.67,1.62l-.14.84.81.27c.62.21,1.03.76,1.09,1.39H5.02c.05-.63.47-1.19,1.09-1.39Zm13.83,3.39c-.33,2.65-1.94,4.95-4.38,6.16-.34.17-.56.52-.56.9v.94h-6v-.94c0-.38-.21-.73-.56-.9-2.44-1.21-4.06-3.52-4.38-6.16h15.88Z"></path>
          </svg>
          <h1 className='text-3xl self-center px-2 font-bold'>Foo<span className='text-[var(--btn-color)]'>die</span></h1>
        </div>

        <div className='desktop-menu flex gap-6'>
          <a href='/' className='group text-lg font-[600] hover:text-[var(--btn-color)] transition-all duration-300 ease-in-out'>
            Home
            <div className='w-0 h-[3px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
          </a>
          <a href='menu' className='group text-lg font-[600] hover:text-[var(--btn-color)] transition-all duration-300 ease-in-out'>
            Menu
            <div className='w-0 h-[3px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
          </a>
          <a href='contact' className='group text-lg font-[600] hover:text-[var(--btn-color)] transition-all duration-300 ease-in-out'>
            Contact Us
            <div className='w-0 h-[3px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
          </a>
          <a href='story' className='group text-lg font-[600] hover:text-[var(--btn-color)] transition-all duration-300 ease-in-out'>
            About Us
            <div className='w-0 h-[3px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
          </a>
        </div>

        <div className='flex items-center'>
          <div onClick={userBtn} className='mx-2 flex justify-center items-center group cursor-pointer'>
            <i className="bx bx-user-circle text-[40px] group-hover:scale-105 transition-all ease-in-out duration-300"></i>
          </div>
          <div onClick={toggleCart} className='mx-2 relative group cursor-pointer'>
            <svg className='group-hover:scale-105 transition-all ease-in-out duration-300'  xmlns="http://www.w3.org/2000/svg" width={42} height={42} fill={"currentColor"} viewBox="0 0 24 24">
              <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95S21.34 7 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM19.47 9l-2.62 6h-6.18l-2.5-6z"></path>
            </svg>
            <span className="absolute w-[24px] top-[50%] right-[-10px] text-base aspect-square rounded-[50%] bg-[var(--btn-color)] text-[#212121] text-center group-hover:top-0 transition-all ease-in-out duration-300">
              {productNumber}
            </span>
          </div>
          <div onClick={toggleMenu} className={`hidden w-8 h-7 flex-col justify-between cursor-pointer ml-4 hamburgerIcon ${isOpen ? 'open' : ''}`}>
            <div className="w-full h-1 bg-[var(--btn-color)] rounded-md transition-all ease-in-out duration-300 menuLine"></div>
            <div className="w-full h-1 bg-[#333] rounded-md transition-all ease-in-out duration-300 menuLine"></div>
            <div className="w-full h-1 bg-[var(--btn-color)] rounded-md transition-all ease-in-out duration-300 menuLine"></div>
          </div>
        </div>
      </nav>

      {/* userlist */}
      <ul className={`${userOpen ? 'userfavorites' : ''} userlogout w-30 absolute bg-white p-6 top-[-200%] right-[6.3%] text-center text-[var(--text-color)] font-medium text-lg
                      rounded-xl border-[2px] border-[var(--btn-color)] shadow-2xl transition-all duration-500 ease-out z-[135]`}>
        <li className='mb-3 group hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
          <a href='favorite'>Favorites</a>
          <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
        </li>
        <li onClick={logoutBtn} className='group cursor-pointer hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
          <a href='login'>
            logout
            <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
          </a>
        </li>
      </ul>

      {/* tablet Menu */}
      <ul className={`${isOpen ? 'mobile-menu-active' : ''} mobile-menu w-80 py-10 flex-col justify-center items-center gap-4 fixed top-[20%]
                      left-[-100%] bg-[#ffffff] border-2 border-[var(--btn-color)] rounded-[2rem] transition-all duration-500 ease-out z-[120]`}
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.05) 8px 8px 8px, rgba(0, 0, 0, 0.05) 8px 8px 8px inset'
      }}>
        <li className='group text-lg text-center p-2 hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
            <a href="/">Home</a>
            <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
        </li>
        <li className='group text-lg text-center p-2 hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
            <a href="menu">Menu</a>
            <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
        </li>
        <li className='group text-lg text-center p-2 hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
            <a href="contact">Contact Us</a>
            <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
        </li>
        <li className='group text-lg text-center p-2 hover:text-[var(--btn-color)] transition-all ease-in-out duration-300'>
            <a href="story">About Us</a>
            <div className='w-0 h-[2px] bg-[var(--btn-color)] group-hover:w-full transition-all ease-in-out duration-300'></div>
        </li>
      </ul>

      {/* cartlist */}
      <div className={`${cartopen ? 'cart-list-active' : ''} cart-list w-[30rem] h-full bg-[#FFFFFF] fixed top-0 right-[-100%]
                      z-[120] transition-all duration-500 ease-in-out`}
           style={{ boxShadow: 'rgba(0, 0, 0, 0.1) -10px -10px 20px'}}>
        <CartList setCartOpen={setCartOpen}/>
      </div>

    </header>
  )
}

export default Navbar
