'use client'

import React, { useState, useMemo } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs, 
  Link,
  Paper,
  TextField,
  Chip,
  Button,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { HealthPackageCard } from '@/components/content/HealthPackageCard'
import { Pagination } from '@/components/ui/Pagination'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'
import { openBottomSheet } from '@/store/bottomSheetSlice'
import { HealthPackage } from '@/types/contentful'

interface HealthCheckupClientProps {
  healthPackages: HealthPackage[]
}

export const HealthCheckupClient: React.FC<HealthCheckupClientProps> = ({ 
  healthPackages: initialPackages 
}) => {
  const [healthPackages] = useState<HealthPackage[]>(initialPackages)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useAppDispatch()

  // Filter packages based on search and category
  const filteredPackages = useMemo(() => {
    let filtered = healthPackages

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(pkg => 
        pkg.fields.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(pkg => {
        const titleMatch = pkg.fields.title.toLowerCase().includes(query)
        const descriptionMatch = pkg.fields.description.toLowerCase().includes(query)
        const categoryMatch = pkg.fields.category?.toLowerCase().includes(query)
        
        // Search in test list
        const testListMatch = pkg.fields.testList?.some(test => {
          if (typeof test === 'string') {
            return test.toLowerCase().includes(query)
          } else {
            return test.title.toLowerCase().includes(query) ||
                   test.tests.some(t => t.toLowerCase().includes(query))
          }
        }) || false

        return titleMatch || descriptionMatch || categoryMatch || testListMatch
      })
    }

    return filtered
  }, [healthPackages, searchQuery, selectedCategory])

  // Extract unique categories from packages
  const availableCategories = useMemo(() => {
    const cats = new Set<string>(['All'])
    healthPackages.forEach(pkg => {
      if (pkg.fields.category) {
        cats.add(pkg.fields.category)
      }
    })
    return Array.from(cats)
  }, [healthPackages])

  // Pagination
  const itemsPerPage = 9
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPackages = filteredPackages.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const handleKnowMore = (packageId: string) => {
    dispatch(openModal({ type: 'package', id: packageId }))
  }

  const handleBookNow = (packageId: string, packageName: string) => {
    dispatch(openBottomSheet({ packageName }))
  }

  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ py: 3 }}>
          <Link href="/" color="inherit">Home</Link>
          <Typography color="text.primary">Book a Health Checkup</Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
          }}
        >
          <Typography 
            variant="h1" 
            color="primary" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Find the right health package for you
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Discover Customized Wellness Plans Designed for Your Unique Health Needs
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by package, tests, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
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
        </Paper>

        {/* Category Filters */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            {availableCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  height: 40,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? 'primary.dark' : 'action.hover',
                  },
                }}
              />
            ))}
            {selectedCategory !== 'All' && (
              <Button
                variant="text"
                onClick={() => setSelectedCategory('All')}
                sx={{ color: 'primary.main', fontWeight: 500 }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Showing {filteredPackages.length} {filteredPackages.length === 1 ? 'package' : 'packages'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </Typography>

        {/* Packages Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 6 
        }}>
          {paginatedPackages.map((pkg) => (
            <HealthPackageCard
              key={pkg.sys.id}
              healthPackage={pkg}
              onKnowMore={() => handleKnowMore(pkg.sys.id)}
              onBookNow={() => handleBookNow(pkg.sys.id, pkg.fields.title)}
            />
          ))}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={filteredPackages.length}
            page={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}

        {filteredPackages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No packages found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  )
}

