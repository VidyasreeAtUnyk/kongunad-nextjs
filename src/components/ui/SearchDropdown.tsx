'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Divider,
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import BusinessIcon from '@mui/icons-material/Business'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import { SearchResult } from '@/hooks/useSearch'

interface SearchDropdownProps {
  results: SearchResult[]
  loading: boolean
  open: boolean
  onSelect: (result: SearchResult) => void
  onViewAll?: (query: string) => void
  query?: string
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'doctor':
      return <LocalHospitalIcon fontSize="small" />
    case 'facility':
      return <BusinessIcon fontSize="small" />
    case 'package':
      return <HealthAndSafetyIcon fontSize="small" />
    default:
      return null
  }
}

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'doctor':
      return 'Doctor'
    case 'facility':
      return 'Facility'
    case 'package':
      return 'Package'
    default:
      return type
  }
}

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'doctor':
      return 'primary'
    case 'facility':
      return 'secondary'
    case 'package':
      return 'success'
    default:
      return 'default'
  }
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  loading,
  open,
  onSelect,
  onViewAll,
  query = '',
}) => {
  if (!open || (results.length === 0 && !loading)) {
    return null
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        maxWidth: '520px',
        maxHeight: '400px',
        overflow: 'auto',
        zIndex: 1300,
        mt: 1,
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : results.length > 0 ? (
        <>
          <List sx={{ py: 0 }}>
            {results.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => onSelect(result)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      // Reserve space to prevent layout shift
                      border: '1px solid transparent',
                      transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '-2px',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Box sx={{ color: `${getTypeColor(result.type)}.main`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {getTypeIcon(result.type)}
                      </Box>
                      <ListItemText
                        primary={result.title}
                        secondary={result.subtitle}
                        primaryTypographyProps={{
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label={getTypeLabel(result.type)}
                        size="small"
                        color={getTypeColor(result.type)}
                        variant="outlined"
                        sx={{ flexShrink: 0 }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          {query && onViewAll && (
            <>
              <Divider />
              <Box sx={{ p: 1.5, textAlign: 'center' }}>
                <Typography
                  component="button"
                  variant="body2"
                  onClick={() => onViewAll(query)}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                    border: 'none',
                    background: 'none',
                    padding: 0,
                  }}
                >
                  View all results for "{query}"
                </Typography>
              </Box>
            </>
          )}
        </>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No results found
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

