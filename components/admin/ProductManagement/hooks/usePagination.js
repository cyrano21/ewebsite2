
import { useState, useEffect, useMemo } from 'react';

const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const indexOfLastItem = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage]);
  const indexOfFirstItem = useMemo(() => indexOfLastItem - itemsPerPage, [indexOfLastItem, itemsPerPage]);

  const currentItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, indexOfFirstItem, indexOfLastItem]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return Math.ceil(items.length / itemsPerPage);
  }, [items, itemsPerPage]);

  return {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    indexOfFirstItem
  };
};

export default usePagination;
