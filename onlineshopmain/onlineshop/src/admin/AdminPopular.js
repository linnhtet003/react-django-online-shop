import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../admincomponents/AdminFunction';
import AdminPagination from '../admincomponents/AdminPagination';
import { toast, ToastContainer } from 'react-toastify';
import { useAdminSearch } from '../admincomponents/AdminSearch';

const AdminPopular = () => {
    const navigate = useNavigate();
    const [popularlist, setPopularlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = 5;
    // search
    const { search } = useAdminSearch();

    // filter search
    const filterPopulars = useMemo(() => {
        return popularlist.filter((popular) =>
            popular.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [popularlist, search]);

    // pagination
    const CurrentPopularData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filterPopulars.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filterPopulars, PageSize]);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        // fetch Type
        const typefetch = () => {
            if (!bearer) {
                navigate('/admin');
                return;
            }
            fetch("http://127.0.0.1:8000/api/neworpolist/", {
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
                    setPopularlist(data)
                })
                .catch(error => console.error(error))
        }

        typefetch();
    }, [navigate])

    // reset page when search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const trenddeletetoast = (data) => {
        toast.dismiss(); // remove all existing toasts
        // const toastId = "delete-confirm"; // fixed id for all delete toasts

        toast(
            ({ closeToast }) => (
                <div>
                    <p className="mb-3">Are you sure you want to delete {data.name}?</p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => {
                                trenddelete(data.id);
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
        )
    }

    const trenddelete = (id) => {
        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/neworpodelete/${id}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        })
        .then(resp => {
            if(resp.ok) {
                setPopularlist(prev => prev.filter( p => p.id !== id));
                toast.success("Trend delete successfully");
            }
        })
        .catch(error => console.error(error));
    }

    return (
        <div>
            <div className='w-full container m-auto min-h-lvh pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
                <ToastContainer position='top-center' autoClose={5000}/>
                <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                    Trendlist
                </h2>

                {/* popular table */}
                <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full text-center font-serif whitespace-nowrap'>
                            <thead>
                                <tr className='text-sm font-medium tracking-wide text-center text-white uppercase bg-[var(--admin-base)]'>
                                    <th className='px-3 py-3 text-left'>No</th>
                                    <th className='px-3 py-3'>Name</th>
                                    <th className='px-3 py-3'>Color</th>
                                    <th className='px-3 py-3'>Created</th>
                                    <th className='px-3 py-3'>Btn</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                                {/* check popularlist */}
                                {popularlist && popularlist.length === 0 ? (
                                    <tr className='text-gray-700 dark:text-gray-400'>
                                        <td colSpan={6}>
                                            There is no popular now.
                                        </td>
                                    </tr>
                                ) : (
                                    // looping current popular
                                    CurrentPopularData.map((popular, index) => (
                                        <tr key={index} className='text-gray-700 dark:text-gray-400'>
                                            {/* popular no */}
                                            <td className='px-3 py-3 text-left text-sm font-semibold'>
                                                {(currentPage - 1) * PageSize + (index + 1)}
                                            </td>
                                            {/* popular name */}
                                            <td className='px-3 py-3'>
                                                <p className='font-semibold'>{popular.name}</p>
                                            </td>
                                            {/* popular color */}
                                            <td className='px-3 py-3'>
                                                <p className='font-semibold'>{popular.color}</p>
                                            </td>
                                            {/* popular created */}
                                            <td className='px-2 py-3 text-sm'>
                                                {formatDateTime(popular.created_at)}
                                            </td>
                                            {/* edit delete */}
                                            <td onClick={(e) => {
                                                e.stopPropagation(); // prevent row click
                                            }}>
                                                <i
                                                    onClick={() => navigate('/admin/popularcreate', { state: { trendId: popular.id }})}
                                                    className='bx bx-edit text-lg text-blue-600 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'></i>
                                                <i
                                                    onClick={() => trenddeletetoast(popular)}
                                                    className='bx bx-trash text-lg text-red-600 ml-3 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'></i>
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
                        totalCount={popularlist.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminPopular
