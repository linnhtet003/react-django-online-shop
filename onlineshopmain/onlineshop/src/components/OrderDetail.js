import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const navigate = useNavigate();
  const [cartproduct, setCartProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartLoad, setCartLoad] = useState(false);
  const [orderingGif, setOrderingGif] = useState(false);
  const [backHome, setBackHome] = useState(false);
  const [order, setOrder] = useState({
    username: "",
    phone: "",
    address: ""
  });

  const orderValue = (e) => {
    let Data = { ...order };
    Data[e.target.name] = e.target.value
    setOrder(Data);
  }

  useEffect(() => {
    const GetCartList = () => {
      const cart = JSON.parse(localStorage.getItem("foodie-cart")) || [];
      setCartProduct(cart)
      setCartLoad(true);
    }
    GetCartList();
    window.addEventListener("CartNumber", GetCartList);
    return () => { window.removeEventListener("CartNumber", GetCartList); };
  }, [])

  useEffect(() => {
    if (!backHome && cartLoad && cartproduct.length <= 0) {
      navigate('/')
      alert("No product in cartlist");
    }
    if (cartproduct) {
      const bill = cartproduct.reduce((subtotal, product) => subtotal + product.quantity * product.price, 0)
      setTotalPrice(parseFloat(bill.toFixed(2)));
    }
  }, [cartproduct, cartLoad, navigate, backHome])

  const orderSend = async (e) => {
    e.preventDefault();

    const orderData = {
      name: order.username,
      phone: order.phone,
      address: order.address,
      total_price: totalPrice,
      cart_items: cartproduct,
    };

    try {
      const bearer = localStorage.getItem('foode-token');
      const order = await fetch("http://127.0.0.1:8000/api/ordercreate/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearer}`
        },
        body: JSON.stringify(orderData),
      });

      const respData = await order.json();
      if (order.status === 401) {
        localStorage.removeItem('foode-token');
        navigate("/login");
      } else {
        if (order.ok) {
          setOrderingGif(true)
          // showing Gif 5s
          setTimeout(() => {
            setOrderingGif(false);
            setBackHome(true);
            navigate('/');
            localStorage.removeItem("foodie-cart");
            window.dispatchEvent(new Event("CartNumber"));
          }, 5000);
        } else {
          console.error("Order failed:", respData)
          alert("Failed to place order.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }

  return (
    <div className='order-width w-[65%] m-auto py-20'>
      {orderingGif ? (
        <div className="flex justify-center">
          <img src='images/orderingprocess.gif' alt='orderingprocess' />
        </div>
      ) : (
        <div className='w-[90%] m-auto border-gray-500 bg-[var(--inner-bg-color)] rounded-lg' style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
          <h2 className='text-center py-6 text-3xl text-[var(--text-color)] font-semibold tracking-wide'>Your Informations</h2>
          <p className='ml-6'>Your ordered <span className='text-lg font-medium text-green-500'>{cartproduct.length}</span> products and total price is <span className='text-lg font-medium text-[var(--btn-color)]'>${totalPrice}</span></p>
          <form onSubmit={orderSend}>
            <h1 className='mt-[5%] ml-[6%] text-gray-600 font-semibold text-lg'>Name</h1>
            <input onChange={orderValue} name='username' type='text' className="text-sm custom-input w-[90%] h-12 ml-[5%] mt-[2%] resize-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-[#A7C1A8] hover:shadow-lg hover:border-[#A7C1A8] bg-[#EEEFE0]"
              placeholder="Enter name here" required />

            <h1 className='mt-[5%] ml-[6%] text-gray-600 font-semibold text-lg'>Phone Number</h1>
            <input onChange={orderValue} name='phone' type='number' className="no-spinner text-sm custom-input w-[90%] h-12 ml-[5%] mt-[2%] resize-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-[#A7C1A8] hover:shadow-lg hover:border-[#A7C1A8] bg-[#EEEFE0]"
              placeholder="Enter phone here" required />

            <h1 className='mt-[5%] ml-[6%] text-gray-600 font-semibold text-lg'>Address</h1>
            <textarea onChange={orderValue} name='address' className="text-sm custom-input w-[90%] h-28 ml-[5%] mt-[2%] resize-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-[#A7C1A8] hover:shadow-lg hover:border-[#A7C1A8] bg-[#EEEFE0]"
              placeholder="Enter address here" required>
            </textarea>

            <div className='flex justify-end items-center h-28 mb-8 mr-6'>
              <button type='submit' className='py-4 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                style={{ background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)' }}>
                Order Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default OrderDetail