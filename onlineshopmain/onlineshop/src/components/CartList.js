import React, { useEffect, useState } from 'react'

const CartList = (props) => {
    const {setCartOpen} = props
    const base_url = "http://127.0.0.1:8000";
    const [cartproduct, setCartProduct] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [removeIndex, setRemovingIndex] = useState(null);

    const quantityPlus = (index) => {
        const updatedCart = [...cartproduct];
        const product = updatedCart[index];
        if(product.quantity + 1 > product.stock){
            alert("Not enough stock avaiable");
            return;
        }
        product.quantity += 1;
        product.total = parseFloat((product.quantity * product.price).toFixed(2));
        updatedCart[index] = product;

        updateCart(updatedCart);
    };
    const quantityMinus = (index) => {
        const updatedCart = [...cartproduct];
        const product = updatedCart[index];
        product.quantity -= 1;

        if(product.quantity <= 0){
            // const itemDiv = document.querySelectorAll(".item-bg")[index];
            // itemDiv.classList.add("cartremove");
            setRemovingIndex(index);


            setTimeout(() => {      // for wait css animation
                updatedCart.splice(index, 1);
                setRemovingIndex(null)
                updateCart(updatedCart);
            }, 300)
        }else{
            product.total = parseFloat((product.quantity * product.price).toFixed(2));
            updatedCart[index] = product;
            updateCart(updatedCart);
        }
    };

    const updateCart = (cart) => {
        setCartProduct(cart);
        localStorage.setItem("foodie-cart", JSON.stringify((cart)));
        window.dispatchEvent(new Event("CartNumber"));
    }

    const GetCartList = () => {
        const cart = JSON.parse(localStorage.getItem("foodie-cart")) || [];
        setCartProduct(cart)
    }
    useEffect(() => {
            GetCartList();
        window.addEventListener("CartNumber", GetCartList);
        return () => {window.removeEventListener("CartNumber", GetCartList);};
    },[])
    useEffect(() => {
        if(cartproduct){
            const bill = cartproduct.reduce((subtotal, product) => subtotal + product.quantity * product.price, 0)
            setTotalPrice(parseFloat(bill.toFixed(2)));
        }
    },[cartproduct])


  return (
    <div className='w-full h-full relative'>
        <div className='absolute top-[7px] right-[7px]'>
            <button className='group rotate-45 rounded-full hover:bg-[var(--btn-color)] transition-all ease-in-out duration-300' onClick={() => setCartOpen(false)}>
                <svg className='group-hover:text-[#FFFFFF] group-hover:scale-95' xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill={"currentColor"} viewBox="0 0 24 24">
                    <path d="M3 13h8v8h2v-8h8v-2h-8V3h-2v8H3z"></path>
                </svg>
            </button>
        </div>
        <h3 className='py-[1.8rem] text-[2rem] capitalize text-[--text-color] font-semibold text-center'>
                Your <span className='text-[--btn-color]'>Cart</span>
        </h3>
        <div className='w-full h-[73.5%] overflow-auto'>
            {cartproduct.length === 0 ? (
                 <div className='text-center text-[1.2rem] text-[var(--text-color)] py-10 font-medium'>
                    🛒 Your cart is empty.
                </div>
            ) : (
                cartproduct && cartproduct.map((product, index) => (
                <div key={product.id}
                    className={`${removeIndex === index ? 'cartremove' : ''} item-bg flex items-center gap-4 py-[.7rem] px-4`}>
                    <div>
                        <img src={`${base_url + product.p_image}`} className='w-[5.3rem] rounded-md' alt=""/>
                    </div>
                    <div className='flex-[2] text-center'>
                        <h4 className='text-[1.3rem] text-[var(--text-color)]'>{product.name}</h4>
                        <h4 className='text-[1.3rem] text-[var(--btn-color)] font-normal mt-[.3rem]'>${product.total.toFixed(2)}</h4>
                    </div>
                    <div className='flex basis-[6.3rem]'>
                        <button onClick={() => quantityMinus(index)} className='w-[1.7rem] aspect-square flex justify-center items-center rounded-full bg-[var(--text-color)] text-xl text-[#ffffff] transition-all ease-in-out duration-300 hover:scale-105'>
                            <i className='bx bx-minus'></i>
                        </button>
                        <h4 className='flex-1 w-full text-[1.2rem] text-center font-normal mx-[.6rem]'>{product.quantity}</h4>
                        <button onClick={() => quantityPlus(index)} className='w-[1.7rem] aspect-square flex justify-center items-center rounded-full bg-[var(--text-color)] text-xl text-[#ffffff] transition-all ease-in-out duration-300 hover:scale-105'>
                            <i className='bx bx-plus'></i>
                        </button>
                    </div>
                </div>
                ))
            )}
        </div>
        <div className='w-full px-3 py-3 absolute bottom-5 bg-[var(--text-color)] flex justify-between items-center'>
            <a href='order' className='py-[.5rem] px-[1rem] bg-[var(--btn-color)] rounded-md text-[1.1rem] text-[#FFFFFF] hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out'>Order Now</a>
            <h2 className='text-[1.2rem] mr-3 font-bold text-[white]'>Total: {totalPrice}<span className='text-[var(--btn-color)]'>$</span></h2>
        </div>
    </div>
  )
}

export default CartList
