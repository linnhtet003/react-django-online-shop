import { useMemo } from "react";

export const formatDateTime = (createdAt) => {
    const date = new Date(createdAt);

    // format: Date Time
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long', // eg. July
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
    })
}

export const shortText = (text, limit) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/); // split whitespace
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
}

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, id) => id + start);
}

export const DOTS = '...';

export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage}) => {

    const paginationRange = useMemo(() => {
            const totalPageCount = Math.ceil(totalCount / pageSize);

        const totalPageNumbers = siblingCount + 5;

        if(totalPageNumbers >= totalPageCount){
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min( currentPage + siblingCount, totalPageCount);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPageCount - 1;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if(!showLeftDots && showRightDots){
            let leftItemCount = 2 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPageCount];
        }

        if(showLeftDots && !showRightDots){
            let rightItemCount = 2 + 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

            return [firstPageIndex, DOTS, ...rightRange];
        }

        if(showLeftDots && showRightDots){
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);

            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
}

// only number and decimal

export const onlyNumberInput = (e, decimal = false) => {
    // checking allow decimal or not
    let value = decimal
        ? e.replace(/[^0-9.]/g, '')
        : e.replace(/[^0-9]/g, '');

    // allow decimal and prevent multiple dots
    if(decimal) {
        const checkdot = value.split('.');
        if(checkdot.length > 2) {
            value = checkdot[0] + '.' + checkdot[1]
        }

        // limit to 2 decimal places
        if(value.includes('.')){
            const [interger, twodecimal] = value.split('.');
            value = interger + '.' + twodecimal.slice(0, 2);
        }
    }

    return value;
};