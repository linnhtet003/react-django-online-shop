import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

const AdminOrderDetail = (props) => {
    const { orderId, orderopen, isEdit, refreshOrder } = props;
    const [orderdetail, setOrderDetail] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [updateorder, setUpdateOrder] = useState(false);

    // edit mode
    useEffect(() => {
        setUpdateOrder(isEdit)
    }, [isEdit]);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        // fetch order
        const orderdetailfetch = () => {
            fetch(`http://127.0.0.1:8000/api/orderdetail/${orderId}/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearer}`
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    setOrderDetail(data)
                    setCartItems(data.cart_items);
                })
                .catch(error => console.error(error))
        }

        orderdetailfetch();
    }, [orderId])

    // increase quantity
    const quantityIncrease = (id, stock) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    if (item.quantity >= stock) return item; // stop at stock
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    };

    // decrease quantity
    const quantityDecrease = (id) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    if (item.quantity === 1) {
                        removeConfirm(item.id);
                        return item;
                    }
                    return { ...item, quantity: item.quantity - 1 }
                }
                return item;
            })
        );
    };

    // remove confirm toast
    const removeConfirm = (id) => {
        toast.dismiss();

        toast(({ closeToast }) => (
            <div>
                <p className="mb-2">Do you want to remove this product?</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                            removeItem(id);
                            closeToast();
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Yes
                    </button>
                    <button
                        onClick={closeToast}
                        className="bg-gray-300 px-3 py-1 rounded"
                    >
                        No
                    </button>
                </div>
            </div>
        ), {
            position: "top-center",
            autoClose: 5000,
            closeOnClick: false,
            closeButton: false,
        });
    }

    // remove item
    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // total price
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const updatecartitems = () => {
        return cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));
    };

    const Orderupdatefetch = () => {
        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/orderupdate/${orderId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearer}`
            },
            body: JSON.stringify({
                cart_items: updatecartitems()
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                toast.error(data.error);
                return;
            }

            toast.success("Order updated!");
            setTimeout(() => {
                setUpdateOrder(false);
                refreshOrder();
                orderopen();
            }, 3000)
        })
        .catch(() => toast.error("Update failed"));
    };

    if (!orderdetail) {
        return <div className='p-10 text-center'>No Data...</div>
    }

    return (
        <div className='w-full bg-white dark:bg-[var(--dark-bg)] rounded-lg shadow-xl container mx-auto mt-4 mb-4'>
            <ToastContainer position='top-center' autoClose={3000} />
            <div className='w-full text-gray-700 dark:text-gray-200 relative md:p-12 p-6 flex flex-wrap rounded-lg'>
                {/* close btn */}
                <div className='absolute top-4 right-4'>
                    <i className='bx bx-x text-2xl text-gray-600 cursor-pointer hover:scale-105 dark:hover:text-gray-400 hover:text-gray-800 transition-all ease-in-out duration-150'
                        onClick={orderopen}></i>
                </div>
                <div className='w-full flex align-middle md:mx-10 mt-8 overflow-x-auto'>
                    {/* customber image, name, phone */}
                    <div className='w-16 aspect-square'>
                        <img className='object-cover w-full h-full rounded-full' src={`http://127.0.0.1:8000${orderdetail.user.user_profile}`} alt='user-image' />
                    </div>
                    <h1 className='mt-[19px] ml-10 md:ml-14 font-bold uppercase'>
                        {orderdetail.name}
                        <span className='font-semibold ml-[7rem] md:ml-[20rem]'>
                            Phone - {orderdetail.phone}
                        </span>
                    </h1>
                </div>
                {/* address */}
                <h2 className='w-full font-semibold md:mx-10 mt-8 md:mt-14 overflow-x-auto'>
                    Address - {orderdetail.address}
                </h2>
                {/* orderlist */}
                <table className='w-full text-left border-collapse md:mx-10 mt-8'>
                    <thead>
                        <tr className='border-b dark:border-gray-700'>
                            <th className='py-3'>Product</th>
                            <th className='py-3'>Price</th>
                            <th className='py-3'>Qty</th>
                            <th className='py-3'>Total</th>
                            { updateorder && <th className='py-3'>Remove</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {/* looping orderlist */}

                        {cartItems.map((order) => (
                            <tr key={order.id} className='border-b dark:border-gray-800'>
                                {/* name */}
                                <td className='py-5'>{order.name}</td>
                                {/* price */}
                                <td className='py-5'>{order.price}</td>
                                {/* quantity */}

                                <td className='py-5'>
                                    {updateorder ? (
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => quantityDecrease(order.id)}
                                                className='px-2 bg-gray-300 rounded'>
                                                -
                                            </button>

                                            <input
                                                type='text'
                                                value={order.quantity}
                                                readOnly
                                                className='w-[3rem] text-center'
                                            />

                                            <button
                                                onClick={() => quantityIncrease(order.id, order.stock)}
                                                className='px-2 bg-gray-300 rounded'>
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        order.quantity
                                    )}
                                </td>

                                {/* totoal */}
                                <td className='py-5'>
                                    {(order.price * order.quantity).toFixed(2)}
                                </td>

                                {/* remove btn */}
                                {updateorder && (
                                    <td>
                                        <i
                                            onClick={() => removeConfirm(order.id)}
                                            className='bx bx-trash text-lg text-red-600 ml-3 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'
                                        ></i>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* total */}
                <div className='w-full md:mx-10 my-6 flex justify-end'>
                    <h2 className='text-lg font-bold'>
                        Total Price : ${totalPrice.toFixed(2)}
                    </h2>
                </div>
                {updateorder && (
                    <div className='w-full flex items-center justify-end h-12'>
                        <button onClick={Orderupdatefetch} type='submit'  className='py-3 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                                style={{background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)'}}>
                            Update
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminOrderDetail
