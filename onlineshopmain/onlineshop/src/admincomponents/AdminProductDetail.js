import React, { useEffect, useState } from 'react'
import { formatDateTime } from './AdminFunction';

const AdminProductDetail = (props) => {
    const { productId, productopen } = props;
    const [ productdetail, setProductDetail ] = useState(null);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        // fetch users
        const productdetailfetch = () => {
            fetch(`http://127.0.0.1:8000/api/productdetail/${productId}/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearer}`
                }
            })
            .then(resp => resp.json())
            .then(data => setProductDetail(data))
            .catch(error => console.error(error))
        }

        productdetailfetch();
    }, [productId])

    if(!productdetail){
        return <div className='p-6'>No data</div>
    }

  return (
    <div className='w-full bg-white dark:bg-[var(--dark-bg)] rounded-lg shadow-xl container mx-auto mt-4 mb-4'>
        <div className='w-full relative md:p-12 p-6 flex flex-wrap rounded-lg'
            style={{boxShadow: `0 12px 0 ${productdetail.popular_or_new_data.color}`}}>
            {/* close btn */}
            <div className='absolute top-4 right-4'>
                <i className='bx bx-x text-2xl text-gray-600 cursor-pointer hover:scale-105 dark:hover:text-gray-400 hover:text-gray-800 transition-all ease-in-out duration-150'
                    onClick={productopen}></i>
            </div>
            <div className='md:basis-1/2 p-10'>
                <img className='md:w-full w-10/12 m-auto hover:scale-105 hover:drop-shadow-[-4px_8px_8px_gray] transition-all duration-300 ease-in-out'
                    src={`http://127.0.0.1:8000${productdetail.p_image}`}
                    alt={productdetail.name}/>
            </div>
            <div className='md:basis-1/2 text-gray-700 dark:text-gray-400'>
                <div className='w-full md:mt-5'>
                    <h1 className='md:text-4xl text-3xl font-sans font-semibold'>
                        {productdetail.name}
                    </h1>
                    <p className='mt-3 font-light'>
                        {productdetail.description}
                    </p>
                    <div className='flex justify-between mt-4'>
                        <h2 className='font-semibold'>
                            <span>Price - </span>
                            ${productdetail.price}
                        </h2>
                        <p className='font-semibold'>
                            <span className='font-semibold'>Stock -   </span>
                            {productdetail.stock}
                        </p>
                    </div>
                    <div className='flex justify-between mt-3 mb-7'>
                        <p className='text-[var(--admin-base)] font-semibold bg-violet-200 inline-block px-2 py-1 rounded-xl'>
                            <span className='font-medium mr-4'>Category -</span>
                            {productdetail.category_data.name}
                        </p>
                        <p className='text-[var(--admin-base)] font-semibold inline-block px-2 py-1 rounded-xl'
                            style={{backgroundColor: `${productdetail.popular_or_new_data.color}`}}>
                            {productdetail.popular_or_new_data.name}
                        </p>
                    </div>
                </div>
                {/* <h1>{productdetail.name}</h1>
                <h1>{productdetail.description}</h1>
                <h1>{productdetail.price}</h1>
                <h1>{productdetail.stock}</h1>
                <h1>{productdetail.popular_or_new_data.name}</h1>
                <h1>{productdetail.popular_or_new_data.color}</h1>
                <h1>{productdetail.category_data.name}</h1>
                <h1>{productdetail.updated_at}</h1>
                <h1>{productdetail.created_at}</h1>
                <h1 onClick={productopen}>close</h1> */}
            </div>
            <div className='absolute right-4 bottom-2 text-sm'>
                <p>
                    {formatDateTime(productdetail.updated_at)}
                </p>
            </div>
        </div>
    </div>
  )
}

export default AdminProductDetail
