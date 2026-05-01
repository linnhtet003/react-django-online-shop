import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { formatDateTime, shortText } from '../admincomponents/AdminFunction'
import AdminPagination from '../admincomponents/AdminPagination';
import AdminOrderDetail from '../admincomponents/AdminOrderDetail';
import { toast, ToastContainer } from 'react-toastify';
import { useAdminSearch } from '../admincomponents/AdminSearch';

const AdminOrder = () => {
  let PageSize = 5;
  const navigate = useNavigate();
  const [orderlist, setOrderlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderopen, setOrderOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  // search
  const { search } = useAdminSearch();

  // filter search
  const filterOrderes = useMemo(() => {
    return orderlist.filter((order) =>
      order.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.toLowerCase().includes(search.toLowerCase()) ||
      order.address?.toLowerCase().includes(search.toLowerCase()) ||
      order.total_price?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orderlist, search]);

  // pagination
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filterOrderes.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filterOrderes, PageSize]);


  // fetch orderlist
  const orderlistfetch = useCallback(() => {
    const bearer = localStorage.getItem('admin-token');
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
      })
      .catch(error => console.error(error))
  }, [navigate]);

  // useeffcet to fetch
  useEffect(() => {
    orderlistfetch();
  }, [orderlistfetch])

  // reset page when search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // open detail (view, edit)
  const openOder = (id, edit = false) => {
    setSelectedOrderId(id);
    setOrderOpen(true);
    setIsEdit(edit);
  }

  const closeOrder = () => {
    setOrderOpen(false);
    setSelectedOrderId(null);
    setIsEdit(false);
  }

  const orderdeletetoast = (data) => {
    toast.dismiss();  // remove all existing toasts
    // const toastId = "delete-confirm"; // fixed id for all delete toasts

    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-3">Are you sure you want to delete {data.user.name}?</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => {
                orderdelete(data.id);
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

  const orderdelete = (id) => {
    const bearer = localStorage.getItem('admin-token');

    fetch(`http://127.0.0.1:8000/api/orderdelete/${id}/`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${bearer}`
      }
    })
    .then(resp => {
      if(resp.ok) {
        setOrderlist(prev => prev.filter(p => p.id !== id));
        toast.success("Order deleted successfully!");
      }
    })
    .catch(error => console.error(error));
  }

  return (
    <div>
      <div className='w-full container m-auto min-h-lvh pb-12 md:pl-64 bg-gray-50 dark:bg-[#121317]'>
        <ToastContainer position='top-center' autoClose={5000} />
        <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
          Orderlist
        </h2>

        {/* order table */}
        <div className='w-full overflow-hidden rounded-lg border-[0.5px] dark:border-none shadow-sm'>
          <div className='w-full overflow-x-auto'>
            <table className='w-full font-serif whitespace-nowrap'>
              <thead>
                <tr className='text-sm font-medium tracking-wide text-left text-white uppercase bg-[var(--admin-base)]'>
                  <th className='px-3 py-3'>Customer</th>
                  <th className='hidden md:block px-3 py-3'>Address</th>
                  <th className='px-3 py-3'>Phone</th>
                  <th className='px-3 py-3'>Total</th>
                  <th className='px-3 py-3'>Date</th>
                  <th className='px-3 py-3'>Btn</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y dark:divide-gray-800 dark:bg-[var(--dark-bg)]'>

                {/* looping orderlist */}
                {orderlist && orderlist.length === 0 ? (
                  <tr className='text-gray-700 dark:text-gray-400'>
                    <td colSpan={6}>
                      There is no order now.
                    </td>
                  </tr>
                ) : (
                  currentTableData.map((order, index) => (
                    <tr key={index} onClick={() => { setSelectedOrderId(order.id); setOrderOpen(true); }} className='text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
                      <td className='px-3 py-3'>
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
                      <td className='hidden md:block px-3 py-3 text-sm'>
                        {shortText(order.address, 7)}
                      </td>
                      {/* phone */}
                      <td className='px-3 py-3 text-sm'>
                        {order.phone}
                      </td>
                      {/* Total Price */}
                      <td className='px-3 py-3 text-sm'>
                        $ {order.total_price}
                      </td>
                      {/* Created At */}
                      <td className='px-3 py-3 text-sm'>
                        {formatDateTime(order.created_at)}
                      </td>
                      <td onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                      }}>
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            openOder(order.id, true);
                          }}
                          className='bx bx-edit text-lg text-blue-600 cursor-pointer hover:scale-110 transition-all duration-150 ease-in-out'></i>
                        <i
                          onClick={() => orderdeletetoast(order)}
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
            totalCount={orderlist.length}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)} />
        </div>
      </div>

      {/* open detail order */}
      {orderopen && selectedOrderId && (
        <div className='absolute inset-x-0 top-20 z-[150]'>
          <AdminOrderDetail
            orderId={selectedOrderId}
            orderopen={closeOrder}
            isEdit={isEdit}
            refreshOrder={orderlistfetch}
          />
        </div>
      )}
    </div>
  )
}

export default AdminOrder
