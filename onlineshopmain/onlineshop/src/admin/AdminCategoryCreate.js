import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AdminCategoryCreate = () => {
    const location = useLocation();
    const pathlink = location.pathname
    const navigate = useNavigate();

    // get edit id from navigation state
    const categoryId = location.state?.categoryId;
    const trendId = location.state?.trendId
    const [category, setcategory] = useState({
        name: ""
    });

    const [loading, setLoading] = useState(false);

    // load old data if edit mode
    useEffect(() => {
        if(!categoryId) return;

        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/categorydetail/${categoryId}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearer}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            setcategory({ name: data.name});
        })
        .catch(error => console.error(error));

    }, [categoryId]);


    const [trend, setTrend] = useState({
        name: "",
        color: ""
    })

    // load old data if edit mode
    useEffect(() => {
        if(!trendId) return;

        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/neworpodetail/${trendId}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearer}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            setTrend(data);
        })
        .catch(error => console.error(error));
    }, [trendId]);

    const categorySubmit = (e) => {
        e.preventDefault();

        if(!category.name.trim()){
            toast.warning("Category name is required");
            return;
        }

        const bearer = localStorage.getItem('admin-token');

        const formData = new FormData();
        formData.append("name", category.name);

        setLoading(true);

        // Update Mode
        if(categoryId) {
            fetch(`http://127.0.0.1:8000/api/categoryupdate/${categoryId}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${bearer}`
                },
                body: formData
            })
            .then(resp => {
                if(resp.ok) {
                    toast.success("Category updated successfully!");
                    setTimeout(() => {
                        navigate('/admin/category');
                    }, 3000);
                }
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
        }
        // Create Mode
        else {
            fetch("http://127.0.0.1:8000/api/categorycreate/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${bearer}`
                },
                body: formData
            })
            .then(resp => {
                if(resp.status === 201) {
                    toast.success("Category created successfully");
                    setcategory({ name: ""});
                }
                if(resp.status === 401) {
                    localStorage.removeItem('admin-token');
                    navigate('/admin')
                }
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
        }

    }

    const TrendSubmit = (e) => {
        e.preventDefault();

        if(!trend.name.trim()) {
            toast.warning("Trend name is required");
            return;
        }

        if(!trend.color.trim()) {
            toast.warning("Trend color is required");
            return;
        }

        const bearer = localStorage.getItem("admin-token");

        const formData = new FormData();
        formData.append("name", trend.name);
        formData.append("color", trend.color);

        setLoading(true);

        // update mode
        if(trendId) {
            fetch(`http://127.0.0.1:8000/api/neworpoupdate/${trendId}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${bearer}`
                },
                body: formData
            })
            .then(resp => {
                if(resp.ok) {
                    toast.success("Trend updated successfully!");
                    setTimeout(() => {
                        navigate('/admin/popular');
                    }, 3000);
                }
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
        }
        // create mode
        else {
            fetch("http://127.0.0.1:8000/api/neworpocreate/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${bearer}`,
                },
                body: formData
            })
            .then((resp) => {
                if (resp.status === 201) {
                    toast.success("Trend created successfully");
                    setTrend({ name: "", color: "" });
                }

                if (resp.status === 401) {
                    localStorage.removeItem("admin-token");
                    navigate("/admin");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
        }
    }

  return (
    <div className={`w-full container m-auto pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]
                        ${pathlink === '/admin/popularcreate'
                            ? 'flex flex-col-reverse'
                            : 'flex flex-col'
                        }`}>
        <ToastContainer position='top-center' autoClose={3000}/>

        {/* creating category design */}
        <div className='w-full md:w-9/12 bg-white dark:bg-[var(--dark-bg)] rounded-lg shadow-xl container mx-auto mt-8 mb-4'>
            <h1 className='text-2xl pt-5 font-bold text-center font-sans text-violet-600'>Create Category</h1>

            {/* create category form */}
            <form onSubmit={categorySubmit}>

                {/* category name */}
                <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Name</h1>
                <input
                    type='text'
                    value={category.name}
                    onChange={(e) => setcategory({ ...category, name: e.target.value})}
                    placeholder='Category Name'
                    className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                />

                {/* Submit button */}
                <div className='flex items-center justify-end h-24 mb-4 mr-6'>
                    <button type='submit' disabled={loading} className='py-3 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                            style={{background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)'}}>
                        {categoryId ? "Update" : "Create"}
                    </button>
                </div>

            </form>
        </div>

        {/* creating Trend design */}
        <div className='w-full md:w-9/12 bg-white dark:bg-[var(--dark-bg)] rounded-lg shadow-xl container mx-auto mt-12 mb-4'>
            <h1 className='text-2xl pt-5 font-bold text-center font-sans text-violet-600'>Create Trend</h1>

            {/* create trend form */}
            <form onSubmit={TrendSubmit}>

                {/* Trend name */}
                <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Name</h1>
                <input
                    type='text'
                    placeholder='Trend Name'
                    value={trend.name}
                    onChange={(e) => setTrend({...trend, name: e.target.value})}
                    className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                />

                {/* Trend color */}
                <h1 className='mt-[5%] ml-[6%] dark:text-gray-400 text-gray-600 font-medium text-lg'>Color</h1>
                <input
                    type='color'
                    // placeholder='Trend Color (red, blue, #ff0000)'
                    value={trend.color}
                    onChange={(e) => setTrend({...trend, color: e.target.value})}
                    className='text-sm dark:text-gray-400 custom-input w-[90%] h-10 ml-[5%] mt-[2%] px-4 py-2 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 dark:focus:outline-none focus:outline-blue-300 hover:shadow-lg dark:hover:border-gray-500 hover:border-blue-300 bg-gray-100'
                />

                {/* Submit button */}
                <div className='flex items-center justify-end h-24 mb-4 mr-6'>
                    <button type='submit'  className='py-3 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                            style={{background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)'}}>
                        {trendId ? "Update" : "Create"}
                    </button>
                </div>

            </form>
        </div>
    </div>
  )
}

export default AdminCategoryCreate
