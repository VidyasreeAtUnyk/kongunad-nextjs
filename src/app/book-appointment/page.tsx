'use client'

import React from 'react'
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material'
import { MakeAppointmentFormV2 as MakeAppointmentForm } from '@/components/forms/MakeAppointmentFormV2'
import { useToast } from '@/components/ui/Toast'

export default function BookAppointmentPage() {
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (data: Record<string, any>) => {
    const { submitForm } = await import('@/lib/form-submission')
    const result = await submitForm('appointment', data)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit appointment request. Please try again.')
    }
  }

  const handleSuccess = () => {
    showSuccess('Appointment request submitted successfully! We will contact you shortly.')
  }

  const handleError = (error: Error) => {
    showError(error.message || 'Failed to submit appointment request. Please try again.')
  }

  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" color="inherit">Home</Link>
          <Typography color="text.primary">Book Appointment</Typography>
        </Breadcrumbs>
        
        <MakeAppointmentForm 
          onSubmit={handleSubmit}
          onSubmitSuccess={handleSuccess}
          onSubmitError={handleError}
        />
      </Container>
    </Box>
  )
}

