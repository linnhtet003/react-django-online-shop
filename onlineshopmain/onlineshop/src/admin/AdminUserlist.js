import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '../admincomponents/AdminFunction';
import AdminPagination from '../admincomponents/AdminPagination';
import { useAdminSearch } from '../admincomponents/AdminSearch';

const AdminUserlist = () => {
    const navigate = useNavigate();
    const [userlist, setUserlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = 5;
    // search valueable
    const { search } = useAdminSearch();

    // filter search
    const filterUseres = useMemo(() => {
        return userlist.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [userlist, search])

    // pagination
    const CurrentUserData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filterUseres.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filterUseres, PageSize]);

    useEffect(() => {
        const bearer = localStorage.getItem('admin-token');
        // fetch users
        const userfetch = () => {
            if (!bearer) {
                navigate('/admin');
                return;
            }
            fetch("http://127.0.0.1:8000/api/userlist/", {
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
                    setUserlist(data)
                })
                .catch(error => console.error(error))
        }

        userfetch();
    }, [navigate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <div>
            <div className='w-full container m-auto min-h-lvh pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
                <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                    Userlist
                </h2>

                {/* user table */}
                <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full font-serif whitespace-nowrap'>
                            <thead>
                                <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                                    <th className='px-3 py-3'>Name</th>
                                    <th className='px-3 py-3'>Email</th>
                                    <th className='px-3 py-3'>Permission</th>
                                    <th className='px-3 py-3'>Date</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                                {/* check userlist */}
                                {userlist && userlist.length === 0 ? (
                                    <tr className='text-gray-700 dark:text-gray-400'>
                                        <td colSpan={4}>
                                            There is no user now.
                                        </td>
                                    </tr>
                                ) : (
                                    // looping current review
                                    CurrentUserData.map((user, index) => (
                                        <tr key={index} className='text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
                                            <td className='px-3 py-3'>
                                                <div className='flex items-center text-sm'>
                                                    <div className='hidden w-8 h-8 mr-3 rounded-full md:block'>
                                                        <img className='object-cover w-full h-full rounded-full' src={user.user_profile} alt='user-image' />
                                                    </div>
                                                    <div>
                                                        {/* user name */}
                                                        <p className='font-semibold'>{user.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* user email */}
                                            <td className='px-2 py-3 text-sm'>
                                                {user.email}
                                            </td>
                                            {/* user permission */}
                                            <td className='px-2 py-3 text-sm'>
                                                {user.is_superuser === true ? (
                                                    <span className='px-4 py-1 leading-tight text-orange-700 bg-orange-100 rounded-full dark:bg-orange-700 dark:text-orange-100'>
                                                        staff
                                                    </span>
                                                ) : (
                                                    <span className='px-4 py-1 leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100'>
                                                        user
                                                    </span>
                                                )}
                                            </td>
                                            {/* user created */}
                                            <td className='px-2 py-3 text-sm'>
                                                {formatDateTime(user.date_joined)}
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
                        totalCount={userlist.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
            )
}

export default AdminUserlist
