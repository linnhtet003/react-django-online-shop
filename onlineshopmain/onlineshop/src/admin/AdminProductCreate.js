import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { onlyNumberInput } from '../admincomponents/AdminFunction';
import { toast, ToastContainer } from 'react-toastify';

const AdminProductCreate = () => {
    const fileRef = useRef(null);
    const location = useLocation();
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();

    // get edit id from navigation state
    const productId = location.state?.productId;
    const [categorylist, setCategorylist] = useState([]);
    const [trendlist, setTrendlist] = useState([]);
    const url = productId
        ? `http://127.0.0.1:8000/api/productupdate/${productId}/`
        : `http://127.0.0.1:8000/api/productcreate/`;

    const method = productId ? "PUT" : "POST";
    const noti = productId ? "You successfully updated the product" : "You successfully created the product";

    const [loading, setLoading] = useState(false);

    // set form data
    const [product, setProduct] = useState({
        name : "",
        description : "",
        price : "",
        stock : "",
        popular_or_new : "",
        category : "",
        p_image: null,
    })

    const productInput = (e) => {
        const {name, value} = e.target;

        let pvalue = value;

        if (name === 'price') {
            pvalue = onlyNumberInput(value, true);
        }

        if (name === 'stock') {
            pvalue = onlyNumberInput(value);
        }
        setProduct({
            ...product,
            [name]: pvalue
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!productId && !product.p_image){
            toast.warning("Please choose an image");
            return;
        }

        setLoading(true);

        const bearer = localStorage.getItem('admin-token');

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("stock", product.stock);
        formData.append("popular_or_new", product.popular_or_new);
        formData.append("category", product.category);
        if(product.p_image) {
            formData.append("p_image", product.p_image);
        }

        fetch( url, {
            method: method,
            headers: {
                Authorization: `Bearer ${bearer}`,
            },
            body: formData
        })
        .then(resp => {
            if(resp.status === 200||resp.status === 201){
                toast.success(noti);

                // navigate only when updating
                if(productId){
                    setTimeout(() => {
                        navigate('/admin/product')
                    }, 3000);
                }
                return resp.json();
            }
            if(resp.status === 400){
                toast.error("Something went wrong");
            }
            if(resp.status === 401){
                localStorage.removeItem('admin-token');
                navigate('/admin');
            }
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }

    const handleFileChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);

            setProduct({
                ...product,
                p_image: e.target.files[0]  // store actual file
            })
        }
    };

    useEffect(() => {
        if(!productId) return;

        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/productdetail/${productId}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearer}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            setProduct({
                name: data.name || "",
                description: data.description || "",
                price: data.price || "",
                stock: data.stock || "",
                category: data.category_data?.id || "",
                popular_or_new: data.popular_or_new_data?.id || "",
                p_image: null
            });

            if(data.p_image) {
                setFileName(data.p_image.split('/').pop());
            }
        })
        .catch(error => console.error(error));

    }, [productId]);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        if (!bearer) {
            navigate('/admin');
            return;
        }

        // fetch categorylist
        const categoryfetch = () => {
            fetch("http://127.0.0.1:8000/api/categorylist/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearer}`
                }
            })
            .then(resp => {
                if (resp.status === 401) {
                    localStorage.removeItem('admin-token')
                    navigate('/admin')
                }
                return resp.json()
            })
            .then(data => {
                setCategorylist(data)
            })
            .catch(error => console.error(error))
        }

        // fetch trend
        const trendfetch = () => {
            fetch("http://127.0.0.1:8000/api/neworpolist/", {
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
                setTrendlist(data)
            })
            .catch(error => console.error(error))
        }

        categoryfetch();
        trendfetch();
    }, [navigate])

  return (
    // name , description, price, stock, p_image, popular_or_new, category
        <div className='w-full container m-auto pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
            <ToastContainer position='top-center' autoClose={2500}/>
            <div className='w-full md:w-9/12 bg-white dark:bg-[var(--dark-bg)] rounded-lg shadow-xl container mx-auto mt-4 mb-4'>
                <h1 className='text-2xl pt-5 font-bold text-center font-sans text-violet-600'>Create Product</h1>

                {/* create product form */}
                <form onSubmit={handleSubmit}>

                    {/* product name */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Name</h1>
                    <input
                        type='text' required
                        name='name'
                        value={product.name}
                        onChange={productInput}
                        placeholder='Product Name'
                        className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                    />

                    {/* product price */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Price</h1>
                    <input
                        type='text' required
                        name='price'
                        inputMode='decimal'
                        value={product.price}
                        placeholder='Product Price'
                        onChange={ productInput }
                        className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                    />

                    {/* product stock */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Stock</h1>
                    <input
                        type='text' required
                        name='stock'
                        value={product.stock}
                        placeholder='Product Stock'
                        onChange={ productInput }
                        className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                    />

                    {/* product category */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Category</h1>
                    <select
                        name='category' required
                        value={product.category}
                        onChange={productInput}
                        className="text-sm mt-[2%] text-[gray] dark:text-gray-400 text-center custom-input w-[90%] ml-[5%] resize-none px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100"
                    >
                        <option value='' disabled hidden>-- Select Category --</option>

                        {/* check categorylist */}
                        {categorylist && categorylist.length === 0 ? (
                            <option value='' className="placeholder:text-[gray]" disabled hidden>-- There is no category --</option>
                        ) : (
                            // looping current category
                            categorylist.map((category, index) => (
                                <option key={index} value={category.id} className='text-[gray]'> -- {category.name} -- </option>
                            ))
                        )}
                    </select>

                    {/* product trend */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Trend</h1>
                    <select
                        name='popular_or_new'   required
                        value={product.popular_or_new}
                        onChange={productInput}
                        className="text-sm mt-[2%] text-[gray] dark:text-gray-400 text-center custom-input w-[90%] ml-[5%] resize-none px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100"
                    >
                        <option value='' disabled hidden>-- Select Trend --</option>

                        {/* check trendlist */}
                        {trendlist && trendlist.length === 0 ? (
                            <option value='' className="placeholder:text-[gray]" disabled hidden>-- There is no trend --</option>
                        ) : (
                            // looping current trend
                            trendlist.map((trend, index) => (
                                <option key={index} value={trend.id} className='text-[gray] text-center'> -- {trend.name} -- </option>
                            ))
                        )}
                    </select>

                    {/* product image */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Image</h1>
                    <input
                        type='file'
                        ref={fileRef}
                        accept='image/*'
                        onChange={handleFileChange}
                        placeholder='Product Image'
                        className='hidden'
                    />

                    <div onClick={() => fileRef.current.click()} className="cursor-pointer text-sm w-[90%] h-10 ml-[5%] mt-[2%] px-4 flex items-center dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100">
                        <span className='text-gray-500 truncate'>{fileName || 'Choose your image'}</span>
                    </div>

                    {/* product description */}
                    <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Description</h1>
                    <textarea
                        name='description'  required
                        value={product.description}
                        onChange={productInput}
                        className="text-sm dark:text-gray-400 custom-input w-[90%] h-28 ml-[5%] mt-[2%] resize-none px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100"
                        placeholder="Enter text here">
                    </textarea>

                    {/* Submit button */}
                    <div className='flex items-center justify-end h-24 mb-4 mr-6'>
                        <button type='submit'  className='py-3 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                                style={{background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)'}}>
                            {loading ? "Saving..." : productId ? "Update" : "Create"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
  )
}

export default AdminProductCreate
