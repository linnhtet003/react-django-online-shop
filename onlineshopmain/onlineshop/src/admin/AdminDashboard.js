import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { formatDateTime, shortText } from '../admincomponents/AdminFunction'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userlist, setUserlist] = useState([]);
  const [orderlist, setOrderlist] = useState([]);
  const [reviewlist, setReviewlist] = useState([]);
  const [totalIcomes, setTotalIcomes] = useState(0);
  const sevenOrders = orderlist.slice(0, 7);
  const fiveReviews = reviewlist.slice(0, 5);
  const fiveUserlist = userlist.slice(0, 5);

  useEffect(() => {
    const bearer = localStorage.getItem('admin-token');
    // uselist
    const userlistfetch = () => {
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
        .then(data => setUserlist(data))
        .catch(error => console.error(error))
    }
    // fetch reviewlist
    const reviewlistfetch = () => {
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
        .then(data => setReviewlist(data))
        .catch(error => console.error(error))
    }
    // fetch orderlist
    const orderlistfetch = () => {
      if (!bearer) {
        navigate('/admin');
        return;
      }
      fetch("http://127.0.0.1:8000/api/orderlist/", {
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
          setOrderlist(data);
          // set Incomes
          const total = data.reduce((sum, order) => {
            const price = parseFloat(order.total_price);
            return !isNaN(price) ? sum + price : sum;
          }, 0);
          setTotalIcomes(total.toFixed(2));
        })
        .catch(error => console.error(error))
    }
    userlistfetch();
    reviewlistfetch();
    orderlistfetch();
  }, [navigate])

  return (
    <div className='w-full h-full pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
      <div className='container mx-auto px-6'>
        <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
          Dashboard
        </h2>

        {/* my github */}
        <a href='https://github.com/linnhtet003/onlineshopp'
          className='flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-[var(--admin-base)] rounded-lg shadow-md'>
          <div className='flex items-center gap-2'>
            <i className='bx bxs-star'></i>
            <span>Star this project on GitHub</span>
          </div>
          <span className='flex items-center gap-2'>View more <i className="bx bx-right-arrow-alt text-xl"></i></span>
        </a>

        {/* cards */}
        <div className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4'>

          {/* total user */}
          <div className='flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-[var(--dark-bg)]'>
            <div className='p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                ></path>
              </svg>
            </div>
            <div>
              <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-400'>
                Total Clients
              </p>
              <p className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                {userlist.length}
              </p>
            </div>
          </div>

          {/* total Renueve */}
          <div className='flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-[var(--dark-bg)]'>
            <div className='p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-400'>
                Total Incomes
              </p>
              <p className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                $ {totalIcomes}
              </p>
            </div>
          </div>

          {/* total order */}
          <div className='flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-[var(--dark-bg)]'>
            <div className='p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                ></path>
              </svg>
            </div>
            <div>
              <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-400'>
                Total Orders
              </p>
              <p className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                {orderlist.length}
              </p>
            </div>
          </div>

          {/* total review */}
          <div className='flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-[var(--dark-bg)]'>
            <div className='p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-400'>
                Total Reviews
              </p>
              <p className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                {reviewlist.length}
              </p>
            </div>
          </div>
        </div>

        {/* order table */}
        <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
          <div className='w-full overflow-x-auto'>
            <table className='w-full font-serif whitespace-nowrap'>
              <thead>
                <tr className='text-sm font-medium tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-800 bg-gray-50 dark:text-gray-400 dark:bg-[var(--dark-bg)]'>
                  <th className='px-4 py-3'>Customer</th>
                  <th className='hidden md:block px-4 py-3'>Address</th>
                  <th className='px-4 py-3'>Phone</th>
                  <th className='px-4 py-3'>Total</th>
                  <th className='px-4 py-3'>Date</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                {/* looping orderlist */}
                {orderlist.length === 0 ? (
                  <tr className='text-gray-700 dark:text-gray-400'>
                    <td colSpan={5}>
                      There is no order now.
                    </td>
                  </tr>
                ) : (
                  sevenOrders.map((order, index) => (
                    <tr key={index} className='text-gray-700 dark:text-gray-400'>
                      <td className='px-4 py-3'>
                        <div className='flex items-center text-sm'>
                          <div className='hidden w-8 h-8 mr-3 rounded-full md:block'>
                            <img className='object-cover w-full h-full rounded-full' src={`http://127.0.0.1:8000${order.user.user_profile}`} alt='user-image' />
                          </div>
                          <div>
                            {/* customber name */}
                            <p className='font-semibold'>{order.user.name}</p>
                          </div>
                        </div>
                      </td>
                      {/* customber address */}
                      <td className='hidden md:block px-4 py-3 text-sm'>
                        {order.address}
                      </td>
                      {/* phone */}
                      <td className='px-4 py-3 text-sm'>
                        {order.phone}
                      </td>
                      {/* Total Price */}
                      <td className='px-4 py-3 text-sm'>
                        $ {order.total_price}
                      </td>
                      {/* Created At */}
                      <td className='px-4 py-3 text-sm'>
                        {formatDateTime(order.created_at)}
                      </td>
                      {/* <td>
                        <i className='bx bx-edit text-lg text-blue-600'></i>
                        <i className='bx bx-trash text-lg text-red-600 ml-3'></i>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* tablelist */}
        <div className='mt-12 grid gap-6 md:grid-cols-2'>

          {/* user table */}
          <div className='w-full h-fit overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
            <div className='w-full overflow-x-auto'>
              <table className='w-full font-serif whitespace-nowrap'>
                <thead>
                  <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                    <th className='px-4 py-3'>Name</th>
                    <th className='px-4 py-3'>Email</th>
                    <th className='px-4 py-3'>Permission</th>
                    <th className='px-4 py-3'>Date</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                  {/* looping userlist */}
                  {userlist.length === 0 ? (
                    <tr className='text-gray-700 dark:text-gray-400'>
                      <td colSpan={5}>
                        There is no user now.
                      </td>
                    </tr>
                  ) : (
                    fiveUserlist.map((user, index) => (
                      <tr key={index} className='text-gray-700 dark:text-gray-400'>
                        <td className='px-4 py-3'>
                          <div className='flex items-center text-sm'>
                            <div className='inline-block w-8 h-8 mr-3 rounded-full md:hidden'>
                              <img className='object-cover w-full h-full rounded-full' src={user.user_profile} alt='user-image' />
                            </div>
                            <div>
                              {/* user name */}
                              <p className='font-semibold'>{user.name}</p>
                            </div>
                          </div>
                        </td>
                        {/* user email */}
                        <td className='px-4 py-3 text-sm'>
                          {user.email}
                        </td>
                        {/* normal or admin */}
                        <td className='px-4 py-3 text-sm'>
                          { user.is_superuser === true ? (
                            <span className='px-4 py-1 leading-tight text-orange-700 bg-orange-100 rounded-full dark:bg-orange-700 dark:text-orange-100'>
                              staff
                            </span>
                          ) : (
                            <span className='px-4 py-1 leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100'>
                              user
                            </span>
                          )}
                        </td>
                        {/* Created At */}
                        <td className='px-4 py-3 text-sm'>
                          {formatDateTime(user.date_joined)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* review table */}
          <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
            <div className='w-full overflow-x-auto'>
              <table className='w-full font-serif whitespace-nowrap'>
                <thead>
                  <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                    <th className='pl-4 pr-2 py-3'>Customer</th>
                    <th className='px-2 py-3'>Rating</th>
                    <th className='px-2 py-3'>About</th>
                    <th className='px-2 py-3'>Message</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                  {/* looping orderlist */}
                  {reviewlist.length === 0 ? (
                    <tr className='text-gray-700 dark:text-gray-400'>
                      <td colSpan={5}>
                        There is no review now.
                      </td>
                    </tr>
                  ) : (
                    fiveReviews.map((review, index) => (
                      <tr key={index} className='text-gray-700 dark:text-gray-400'>
                        <td className='pl-4 pr-2 py-3'>
                          <div className='flex items-center text-sm'>
                            <div className='inline-block w-8 h-8 mr-3 rounded-full md:hidden'>
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
