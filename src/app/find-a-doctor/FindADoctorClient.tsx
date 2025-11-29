'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs, 
  Link,
  Paper,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { DoctorCard } from '@/components/content/DoctorCard'
import { Pagination } from '@/components/ui/Pagination'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'
import { Doctor } from '@/types/contentful'

interface FindADoctorClientProps {
  doctors: Doctor[]
}

export const FindADoctorClient: React.FC<FindADoctorClientProps> = ({ 
  doctors: initialDoctors 
}) => {
  const [doctors] = useState<Doctor[]>(initialDoctors)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search query (300ms delay)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  // Extract unique departments and specialties
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>(['All'])
    doctors.forEach(doctor => {
      if (doctor.fields.department) {
        depts.add(doctor.fields.department)
      }
    })
    return Array.from(depts).sort()
  }, [doctors])

  const availableSpecialties = useMemo(() => {
    const specs = new Set<string>(['All'])
    doctors.forEach(doctor => {
      if (doctor.fields.speciality) {
        specs.add(doctor.fields.speciality)
      }
    })
    return Array.from(specs).sort()
  }, [doctors])

  // Filter doctors based on search, department, and specialty
  const filteredDoctors = useMemo(() => {
    let filtered = doctors

    // Filter by department
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.fields.department?.toLowerCase() === selectedDepartment.toLowerCase()
      )
    }

    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.fields.speciality?.toLowerCase() === selectedSpecialty.toLowerCase()
      )
    }

    // Filter by search query (using debounced value)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(doctor => {
        const nameMatch = doctor.fields.doctorName.toLowerCase().includes(query)
        const departmentMatch = doctor.fields.department?.toLowerCase().includes(query)
        const specialtyMatch = doctor.fields.speciality?.toLowerCase().includes(query)
        const degreesMatch = Array.isArray(doctor.fields.degrees) && doctor.fields.degrees.some(degree => 
          String(degree).toLowerCase().includes(query)
        ) || false
        
        return nameMatch || departmentMatch || specialtyMatch || degreesMatch
      })
    }

    return filtered
  }, [doctors, debouncedSearchQuery, selectedDepartment, selectedSpecialty])

  // Pagination
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, selectedDepartment, selectedSpecialty])

  const handleViewProfile = useCallback((doctorId: string) => {
    dispatch(openModal({ type: 'doctor', id: doctorId }))
  }, [dispatch])

  const handleBookAppointment = useCallback((doctorName: string, department: string) => {
    // Navigate to appointment page with doctor info as query params
    const params = new URLSearchParams({
      doctor: doctorName,
      department: department,
    })
    router.push(`/book-appointment?${params.toString()}`)
  }, [router])

  const handleClearFilters = useCallback(() => {
    setSelectedDepartment('All')
    setSelectedSpecialty('All')
    setSearchQuery('')
  }, [])

  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ py: 3 }}>
          <Link href="/" color="inherit">Home</Link>
          <Typography color="text.primary">Find a Doctor</Typography>
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
            Find the right doctor for you
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Connect with our experienced specialists and get the care you deserve
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by doctor name, department, or specialty..."
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

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'flex-start' },
            }}
          >
            {/* Department Filter */}
            {availableDepartments.length > 1 && (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 0', md: '0 0 30%'} }}>
                <FormControl fullWidth>
                  <InputLabel id="department-filter-label">Department</InputLabel>
                  <Select
                    labelId="department-filter-label"
                    id="department-filter"
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {availableDepartments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Specialty Filter */}
            {availableSpecialties.length > 1 && (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 0', md: '0 0 30%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="specialty-filter-label">Specialty</InputLabel>
                  <Select
                    labelId="specialty-filter-label"
                    id="specialty-filter"
                    value={selectedSpecialty}
                    label="Specialty"
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {availableSpecialties.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Clear All Filters Button */}
            {(selectedDepartment !== 'All' || selectedSpecialty !== 'All' || searchQuery) && (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 0', md: '0 0 auto' }, display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={handleClearFilters}
                  sx={{ 
                    height: '56px',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
          {selectedDepartment !== 'All' && ` in ${selectedDepartment}`}
          {selectedSpecialty !== 'All' && ` - ${selectedSpecialty}`}
        </Typography>

        {/* Doctors Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3, 
          mb: 6 
        }}>
          {paginatedDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.sys.id}
              doctor={doctor}
              onViewProfile={() => handleViewProfile(doctor.sys.id)}
              onBookAppointment={() => handleBookAppointment(
                doctor.fields.doctorName,
                doctor.fields.department
              )}
            />
          ))}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={filteredDoctors.length}
            page={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}

        {filteredDoctors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No doctors found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  )
}

