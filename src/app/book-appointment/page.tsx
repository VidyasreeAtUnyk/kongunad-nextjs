'use client'

import React from 'react'
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material'
import { MakeAppointmentFormV2 as MakeAppointmentForm } from '@/components/forms/MakeAppointmentFormV2'

export default function BookAppointmentPage() {
  const handleSubmit = async (data: Record<string, any>) => {
    // TODO: Implement API call to submit appointment data
    console.log('Appointment data:', data)
    // Example API call:
    // await fetch('/api/appointments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    
    // For now, just show success
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Appointment request submitted successfully! We will contact you shortly.')
        resolve()
      }, 500)
    })
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
          onSubmitSuccess={() => {
            // FormBuilder already handles the default success message
          }}
        />
      </Container>
    </Box>
  )
}

