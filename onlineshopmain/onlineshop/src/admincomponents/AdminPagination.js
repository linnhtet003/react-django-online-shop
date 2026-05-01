import React from 'react'
import { usePagination, DOTS } from './AdminFunction'

const AdminPagination = (props) => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize
    } = props

    const paginationRange = usePagination({
        currentPage, totalCount, siblingCount, pageSize
    });

    if(currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        const totalPage = Math.ceil(totalCount / pageSize);
        if(currentPage < totalPage){
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if(currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // let lastPage = paginationRange[paginationRange.length -1];

  return (
    <div>
      <ul className='w-full h-12 list-none text-sm text-gray-700 dark:text-gray-400 flex justify-center gap-4 items-center'>
        <li onClick={onPrevious} className='group hover:text-indigo-600 cursor-pointer'>
            <i className='group-hover:opacity-100 opacity-0 bx bx-chevrons-left'></i> prev
        </li>
        {paginationRange.map((pageNumber, index) => {
            if(pageNumber === DOTS){
                return <li key={index}>&#8230;</li>
            }
            return(
                <li key={index} onClick={() => onPageChange(pageNumber)} className={`w-[19px] text-center rounded-md ${pageNumber === currentPage ? "bg-indigo-600 text-white dark:text-gray-200" : "hover:text-indigo-600"} cursor-pointer`}>
                    {pageNumber}
                </li>
            )
        })}
        <li onClick={onNext} className='group hover:text-indigo-600 cursor-pointer'>
            next <i className='group-hover:opacity-100 opacity-0 bx bx-chevrons-right'></i>
        </li>
      </ul>
    </div>
  )
}

export default AdminPagination
