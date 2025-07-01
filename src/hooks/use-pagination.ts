
"use client";

import { useState, useMemo } from 'react';

export function usePagination<T>(data: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const canNextPage = currentPage < totalPages;
    const canPrevPage = currentPage > 1;

    return {
        currentPage,
        totalPages,
        paginatedData,
        nextPage,
        prevPage,
        canNextPage,
        canPrevPage
    };
}
