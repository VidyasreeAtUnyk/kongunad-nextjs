import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { Doctor } from '@/types/contentful'

interface DoctorCardProps {
  doctor: Doctor
  onClick?: () => void
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const { fields } = doctor
  
  return (
    <Card 
      sx={{ 
        maxWidth: 300, 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https:${fields.photo.fields.file.url}`}
        alt={fields.doctorName}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {fields.doctorName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {fields.department}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 2 }}>
          <Chip 
            label={fields.speciality} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`${fields.experience} years`} 
            size="small" 
            color="secondary" 
            variant="outlined" 
          />
        </Box>
        {fields.degrees && fields.degrees.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
            {/* {fields.degrees.join(', ')} */}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}




