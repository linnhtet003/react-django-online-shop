import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPagination from '../admincomponents/AdminPagination';
import { shortText } from '../admincomponents/AdminFunction';
import { toast, ToastContainer } from 'react-toastify';
import { useAdminSearch } from '../admincomponents/AdminSearch';

const AdminReview = () => {
    const navigate = useNavigate();
    const [reviewlist, setReviewlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = 5;
    // search
    const { search } = useAdminSearch();

    // filter search
    const filterReviews = useMemo(() => {
        return reviewlist.filter((review) =>
            review.created_by_data?.name?.toLowerCase().includes(search.toLowerCase()) ||
            review.option.toLowerCase().includes(search.toLowerCase())
        );
    }, [reviewlist, search]);

    // pagination
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filterReviews.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filterReviews, PageSize]);


    // fetch reviews
    useEffect(() => {
        const reviewfetch = () => {
            const bearer = localStorage.getItem('admin-token');

            if (!bearer) {
                navigate('/admin');
                return;
            }
            fetch("http://127.0.0.1:8000/api/reviewlist/", {
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
                    setReviewlist(data);
                })
                .catch(error => console.error(error))
        }
        reviewfetch();
    }, [navigate])

    // reset page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const reviewdeletetoast = (data) => {
        toast.dismiss();  // remove all existing toasts
                // const toastId = "delete-confirm"; // fixed id for all delete toasts

        toast(
            ({ closeToast}) => (
                <div>
                    <p className="mb-3">Are you sure you want to delete {data.name}?</p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => {
                                reviewdelete(data.id);
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
                autoClose: 5000,
                closeOnClick: false,
                closeButton: false,
            }
        );
    };

    const reviewdelete = (id) => {
        const bearer = localStorage.getItem('admin-token');

        fetch(`http://127.0.0.1:8000/api/reviewdelete/${id}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        })
        .then(resp => {
            if(resp.ok) {
                setReviewlist(prev => prev.filter(p => p.id !== id));
                toast.success("Review deleted successfully!");
            }
        })
        .catch(error => console.error(error));
    }

    return (
        <div>
            <div className='w-full container m-auto min-h-lvh pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
                <ToastContainer position='top-center' autoClose={5000}/>
                <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                    Reviewlist
                </h2>

                {/* review table */}
                <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full font-serif whitespace-nowrap'>
                            <thead>
                                <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                                    <th className='px-3 py-3'>Customer</th>
                                    <th className='px-3 py-3'>Rating</th>
                                    <th className='px-3 py-3'>About</th>
                                    <th className='px-3 py-3'>Message</th>
                                    <th className='px-3 py-3'>Btn</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                                {/* checking review */}
                                {reviewlist && reviewlist.length === 0 ? (
                                    <tr className='text-gray-700 dark:text-gray-400'>
                                        <td colSpan={6}>
                                            There is no review now.
                                        </td>
                                    </tr>
                                ) : (
                                    // looping current review
                                    currentTableData.map((review) => (
                                        <tr key={review.id} className='text-gray-700 dark:text-gray-400'>
                                            <td className='px-3 py-3'>
                                                <div className='flex items-center text-sm'>
                                                    <div className='hidden w-8 h-8 mr-3 rounded-full md:block'>
                                                        <img className='object-cover w-full h-full rounded-full' src={`http://127.0.0.1:8000${review.created_by_data.user_profile}`} alt='user-image' />
                                                    </div>
                                                    <div>
                                                        {/* customber name */}
                                                        <p className='font-semibold'>{review.created_by_data.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* rating */}
                                            <td className='px-2 py-3 text-sm'>
                                                {review.starrating}
                                            </td>
                                            {/* about */}
                                            <td className='px-2 py-3 text-sm'>
                                                {review.option}
                                            </td>
                                            {/* message */}
                                            <td className='px-2 py-3 text-sm'>
                                                {shortText(review.message, 7)}
                                            </td>
                                            {/* edit delete */}
                                            <td>
                                                <i
                                                    onClick={() => reviewdeletetoast(review)}
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
                        totalCount={filterReviews.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminReview
