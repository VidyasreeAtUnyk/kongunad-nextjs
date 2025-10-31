import React from 'react'
import {
  TextField,
  InputAdornment,
  Box,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  fullWidth?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  onSearch,
  fullWidth = true 
}) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        variant="outlined"
        onChange={handleSearch}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}




