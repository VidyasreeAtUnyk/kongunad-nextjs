'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Download as DownloadIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material'
import { FormSubmission } from '@/lib/supabase'

interface SubmissionsResponse {
  submissions: FormSubmission[]
  total: number
  limit: number
  offset: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = checking, true = authenticated, false = not authenticated

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch submissions - if unauthorized, will redirect
        const response = await fetch('/api/admin/submissions?limit=1', {
          credentials: 'include', // Important: include cookies
        })
        if (response.status === 401) {
          setIsAuthenticated(false)
          router.replace('/admin/login')
          return
        }
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.replace('/admin/login')
        }
      } catch {
        setIsAuthenticated(false)
        router.replace('/admin/login')
      }
    }
    
    checkAuth()
  }, [router])
  
  // Filters
  const [formTypeFilter, setFormTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Pagination
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)

  // Request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce search query (500ms delay)
  useEffect(() => {
    setSearchLoading(true)
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setSearchLoading(false)
      // Reset to page 1 when search changes
      if (searchQuery !== debouncedSearchQuery) {
        setPage(1)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      setSearchLoading(false)
    }
  }, [searchQuery, debouncedSearchQuery])

  const fetchSubmissions = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
      })

      if (formTypeFilter !== 'all') {
        params.append('formType', formTypeFilter)
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (debouncedSearchQuery) {
        params.append('search', debouncedSearchQuery)
      }

      const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
        credentials: 'include', // Important: include cookies
        signal: abortController.signal,
      })
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data: SubmissionsResponse = await response.json()
      setSubmissions(data.submissions)
      setTotal(data.total)
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      // Only update loading state if request wasn't aborted
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [page, formTypeFilter, statusFilter, debouncedSearchQuery, router, limit])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchSubmissions, isAuthenticated])

  // Define preferred field order for each form type
  const getFieldOrder = (formType: string): string[] => {
    const orders: Record<string, string[]> = {
      appointment: [
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'gender',
        'department',
        'preferredDate',
        'preferredTime',
        'medicalCondition',
      ],
      checkup: [
        'firstName',
        'lastName',
        'email',
        'phone',
        'city',
        'gender',
        'preferredDate',
        'packageType',
      ],
      research: [
        'firstName',
        'lastName',
        'age',
        'gender',
        'email',
        'phone',
        'qualification',
        'district',
        'state',
        'pgNeetStatus',
        'query',
      ],
      job: [
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
        'designation',
        'experience',
        'currentSalary',
        'expectedSalary',
        'resume',
      ],
    }
    return orders[formType] || []
  }

  // Format field value for display (handles file metadata)
  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A'
    }
    
    // Handle file metadata (from serialized File objects)
    if (typeof value === 'object' && value._isFile) {
      const sizeKB = (value.fileSize / 1024).toFixed(2)
      const sizeMB = (value.fileSize / (1024 * 1024)).toFixed(2)
      const size = value.fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
      return `📎 ${value.fileName} (${size}, ${value.fileType || 'Unknown type'})`
    }
    
    // Check if it's a file-like object without the _isFile flag (backward compatibility)
    if (typeof value === 'object' && (value.fileName || value.name)) {
      const fileName = value.fileName || value.name
      const fileSize = value.fileSize || value.size || 0
      const sizeKB = (fileSize / 1024).toFixed(2)
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2)
      const size = fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
      return `📎 ${fileName} (${size})`
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    
    return String(value)
  }

  // Sort form data entries by preferred order - MUST be before any early returns
  const getOrderedFormData = useMemo(() => {
    return (formData: Record<string, any>, formType: string) => {
      const order = getFieldOrder(formType)
      const entries = Object.entries(formData).filter(([key]) => key !== 'securityCode')
      
      // Sort: first by order array, then alphabetically for any remaining fields
      return entries.sort(([keyA], [keyB]) => {
        const indexA = order.indexOf(keyA)
        const indexB = order.indexOf(keyB)
        
        // If both are in order array, sort by their position
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }
        // If only A is in order, A comes first
        if (indexA !== -1) return -1
        // If only B is in order, B comes first
        if (indexB !== -1) return 1
        // If neither is in order, sort alphabetically
        return keyA.localeCompare(keyB)
      })
    }
  }, [])

  // Handle file download - MUST be before any early returns
  const handleFileDownload = useCallback(async (filePath: string) => {
    try {
      const response = await fetch(`/api/files/download?path=${encodeURIComponent(filePath)}`, {
        credentials: 'include',
      })
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to generate download URL')
      }
      
      const data = await response.json()
      if (data.url) {
        // Open download in new tab
        window.open(data.url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      setError('Failed to download file. Please try again.')
    }
  }, [router])

  // Show loading skeleton while checking authentication - prevents layout shift
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          py: 4, 
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">
          {/* Header skeleton */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width={300} height={40} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>

          {/* Filters skeleton */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rectangular" width={300} height={56} sx={{ borderRadius: 1, flex: 1, minWidth: 200 }} />
              <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={120} height={56} sx={{ borderRadius: 1 }} />
            </Box>
          </Paper>

          {/* Table skeleton */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton variant="text" width={100} height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" width={j === 6 ? 40 : 120} height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    )
  }

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setDialogOpen(true)
  }

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ id: submissionId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Refresh submissions
      fetchSubmissions()
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: newStatus as 'pending' | 'reviewed' | 'contacted' | 'archived',
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleExport = () => {
    // Simple CSV export
    const headers = ['ID', 'Form Type', 'Status', 'Created At', 'Name', 'Email', 'Phone']
    const rows = submissions.map((s) => {
      const data = s.form_data
      return [
        s.id,
        s.form_type,
        s.status,
        new Date(s.created_at).toLocaleString(),
        `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        data.email || '',
        data.phone || '',
      ]
    })

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      reviewed: 'primary',
      contacted: 'success',
      archived: 'default',
    }
    return colors[status] || 'default'
  }

  const getFormTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      appointment: 'Appointment',
      checkup: 'Health Checkup',
      research: 'Research',
      job: 'Job Application',
    }
    return labels[type] || type
  }

// Memoized table row component for better performance
const SubmissionTableRow = React.memo(({
  submission,
  onViewDetails,
  onStatusChange,
  getFormTypeLabel,
}: {
  submission: FormSubmission
  onViewDetails: (submission: FormSubmission) => void
  onStatusChange: (id: string, status: string) => void
  getFormTypeLabel: (type: string) => string
}) => {
  const data = submission.form_data
  const name = useMemo(
    () => `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A',
    [data.firstName, data.lastName]
  )
  const formattedDate = useMemo(
    () => new Date(submission.created_at).toLocaleString(),
    [submission.created_at]
  )

  return (
    <TableRow hover>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <Chip label={getFormTypeLabel(submission.form_type)} size="small" />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{data.email || 'N/A'}</TableCell>
      <TableCell>{data.phone || 'N/A'}</TableCell>
      <TableCell>
        <Select
          value={submission.status}
          size="small"
          onChange={(e) => onStatusChange(submission.id, e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="reviewed">Reviewed</MenuItem>
          <MenuItem value="contacted">Contacted</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={() => onViewDetails(submission)}
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if submission data or handlers change
  return (
    prevProps.submission.id === nextProps.submission.id &&
    prevProps.submission.status === nextProps.submission.status &&
    prevProps.submission.form_data === nextProps.submission.form_data
  )
})

SubmissionTableRow.displayName = 'SubmissionTableRow'

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 4, 
        backgroundColor: 'background.default',
        // Prevent layout shift
        minWidth: '100%',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Form Submissions Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={submissions.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                endAdornment: searchLoading ? <CircularProgress size={20} /> : null,
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Form Type</InputLabel>
              <Select
                value={formTypeFilter}
                label="Form Type"
                onChange={(e: SelectChangeEvent) => setFormTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="appointment">Appointment</MenuItem>
                <MenuItem value="checkup">Health Checkup</MenuItem>
                <MenuItem value="research">Research</MenuItem>
                <MenuItem value="job">Job Application</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="reviewed">Reviewed</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchSubmissions}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Pagination */}
        {total > 0 && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
              {/* Pagination Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} submissions
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Rows per page</InputLabel>
                  <Select
                    value={limit}
                    label="Rows per page"
                    onChange={(e: SelectChangeEvent<number>) => {
                      setLimit(Number(e.target.value))
                      setPage(1) // Reset to first page when changing page size
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Pagination Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pagination
                  count={Math.ceil(total / limit)}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Box>
            </Box>
          </Paper>
        )}

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Form Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No submissions found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <SubmissionTableRow
                    key={submission.id}
                    submission={submission}
                    onViewDetails={handleViewDetails}
                    onStatusChange={handleStatusChange}
                    getFormTypeLabel={getFormTypeLabel}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Submission Details
            {selectedSubmission && (
              <Chip
                label={selectedSubmission.status}
                color={getStatusColor(selectedSubmission.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </DialogTitle>
          <DialogContent>
            {selectedSubmission && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Submission ID: {selectedSubmission.id}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  {getOrderedFormData(selectedSubmission.form_data, selectedSubmission.form_type)
                    .map(([key, value]) => {
                      const isFile = value && typeof value === 'object' && value._isFile && value.filePath
                      
                      return (
                        <Box key={key} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1" color="text.secondary" sx={{ flex: '0 1 auto' }}>
                              {formatFieldValue(value)}
                            </Typography>
                            {isFile && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<GetAppIcon />}
                                onClick={() => handleFileDownload(value.filePath)}
                                sx={{ flexShrink: 0 }}
                              >
                                Download
                              </Button>
                            )}
                          </Box>
                        </Box>
                      )
                    })}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

