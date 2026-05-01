import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPagination from '../admincomponents/AdminPagination';
import { formatDateTime, shortText } from '../admincomponents/AdminFunction';
import AdminProductDetail from '../admincomponents/AdminProductDetail';
import { toast, ToastContainer } from 'react-toastify';
import { useAdminSearch } from '../admincomponents/AdminSearch';

const AdminProduct = () => {
    const navigate = useNavigate();
    const [productlist, setProductlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productopen, setProductOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    let PageSize = 5;
    // search
    const { search } = useAdminSearch();

    // filter search
    const filterProducts = useMemo(() => {
        return productlist.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.price.toLowerCase().includes(search.toLowerCase()) ||
            product.category_data?.name.toLowerCase().includes(search.toLowerCase()) ||
            product.popular_or_new_data?.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [productlist, search])

    const CurrentProductData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filterProducts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filterProducts, PageSize]);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        // fetch products
        const productfetch = () => {
            if (!bearer) {
                navigate('/admin');
                return;
            }
            fetch("http://127.0.0.1:8000/api/productlist/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearer}`
                }
            })
            .then(resp => {
                if(resp.status === 401) {
                    localStorage.removeItem('admin-token')
                    navigate('/admin')
                }
                return resp.json()
            })
            .then(data => {
                setProductlist(data)
            })
            .catch(error => console.error(error))
        }

        productfetch();
    }, [navigate]);

    // reset page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const productdeletetoast = (data) => {
        toast.dismiss();  // remove all existing toasts
        // const toastId = "delete-confirm"; // fixed id for all delete toasts

        toast(
            ({ closeToast }) => (
                <div>
                    <p className="mb-3">Are you sure you want to delete {data.name}?</p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => {
                                productdelete(data.id);
                                closeToast();
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => closeToast()}
                            className="px-3 py-1 bg-gray-300 rounded"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                // toastId: toastId,   // ✅ only one toast at a time
                position: "top-center",
                autoClose: 7000,
                closeOnClick: false,
                closeButton: false,
            }
        );
    };

    const productdelete = (id) => {
        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/productdelete/${id}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        })
        .then(resp => {
            if(resp.ok) {
                setProductlist(prev => prev.filter(p => p.id !== id));
                toast.success("Product deleted successfully!");
            }
        })
        .catch(error => console.error(error));
    }

    return (
        <div className='w-full relative'>
            <ToastContainer position='top-center' autoClose={5000}/>
            <div className='w-full container m-auto min-h-lvh pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
                <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                    Productlist
                </h2>

                {/* product table */}
                <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full font-serif whitespace-nowrap'>
                            <thead>
                                <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                                    <th className='px-3 py-3'>Image</th>
                                    <th className='px-3 py-3'>Name</th>
                                    <th className='hidden md:block px-3 py-3'>Description</th>
                                    <th className='px-3 py-3'>Price</th>
                                    <th className='px-3 py-3'>Stock</th>
                                    <th className='px-3 py-3'>Created</th>
                                    <th className='px-3 py-3'>Btn</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>
                                {/* check userlist */}
                                {productlist && productlist.length === 0 ? (
                                    <tr className='text-gray-700 dark:text-gray-400'>
                                        <td colSpan={6}>
                                            There is no product now.
                                        </td>
                                    </tr>
                                ) : (
                                    // looping current product
                                    CurrentProductData.map((product, index) => (
                                        <tr key={index} onClick={() => { setSelectedProductId(product.id);setProductOpen(true); }} className='h-14 text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
                                            {/* product image */}
                                            <td className='w-8 aspect-square px-2 py-1'>
                                                <img className='object-cover w-full h-full rounded-full' src={`http://127.0.0.1:8000${product.p_image}`} alt='user-image' />
                                            </td>
                                            {/* product name */}
                                            <td className='px-3 py-3'>
                                                <p className='font-semibold'>{product.name}</p>
                                            </td>
                                            {/* product description */}
                                            <td className='hidden md:block px-2 py-3 text-sm'>
                                                {shortText(product.description, 7)}
                                            </td>
                                            {/* product price */}
                                            <td className='px-2 py-3 text-sm'>
                                                {product.price}
                                            </td>
                                            {/* product stock */}
                                            <td className='px-2 py-3 text-sm'>
                                                {product.stock}
                                            </td>
                                            {/* product created */}
                                            <td className='px-2 py-3 text-sm'>
                                                {formatDateTime(product.created_at)}
                                            </td>
                                            {/* edit delete */}
                                            <td onClick={(e) => {
                                                e.stopPropagation(); // prevent row click
                                                }}>
                                                <i
                                                    onClick={() => navigate('/admin/productcreate', {state: { productId: product.id }})}
                                                    className='bx bx-edit text-lg text-blue-600 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'></i>
                                                <i
                                                    onClick={() => productdeletetoast(product)}
                                                    className='bx bx-trash text-lg text-red-600 ml-3 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'
                                                ></i>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* pagination */}
                <div className='w-full flex justify-end'>
                    <AdminPagination
                        currentPage={currentPage}
                        totalCount={productlist.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>

            {/* open detail product */}
            {productopen && selectedProductId && (
                <div className='absolute inset-x-0 -top-3 z-[150]'>
                    <AdminProductDetail
                        productId = {selectedProductId}
                        productopen = {() => setProductOpen(false)}
                    />
                </div>
            )}
        </div>
    )
}

export default AdminProduct
