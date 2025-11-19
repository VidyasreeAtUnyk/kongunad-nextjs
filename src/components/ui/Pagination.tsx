'use client'

import React from 'react'
import { Box, Pagination as MuiPagination } from '@mui/material'

interface PaginationProps {
  count: number
  page: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  showInfo?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  onPageChange,
  itemsPerPage = 9,
  showInfo = true,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (totalPages <= 1) return null

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 2,
        mt: 4,
        mb: 2
      }}
    >
      {showInfo && (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, count)} of {count}
        </Box>
      )}
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

