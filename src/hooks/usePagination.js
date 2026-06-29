import { useState } from 'react'
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [pageSize] = useState(initialPageSize)
  const paginationParams = { page, page_size: pageSize }
  return { page, pageSize, setPage, paginationParams }
}
