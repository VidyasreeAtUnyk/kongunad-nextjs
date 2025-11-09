'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { HealthPackage } from '@/types/contentful'

interface HealthPackageCardProps {
  healthPackage: HealthPackage
  onClick?: () => void
  onKnowMore?: () => void
  onBookNow?: () => void
}

export const HealthPackageCard: React.FC<HealthPackageCardProps> = ({ 
  healthPackage, 
  onClick,
  onKnowMore,
  onBookNow
}) => {
  const { fields } = healthPackage
  
  return (
    <Card 
      sx={{ 
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
      {/* Icon on top */}
      {fields.icon?.fields?.file?.url ? (
        <Box
          sx={{
            width: 'auto',
            height: 80,
            backgroundColor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            p: 2,
          }}
        >
          <Box
            component="img"
            src={`https:${fields.icon.fields.file.url}`}
            alt={fields.title}
            sx={{ 
              width: 'auto',
              height: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: 'auto',
            height: 80,
            backgroundColor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            color: 'text.secondary'
          }}
        >
          <Typography variant="caption">No Icon</Typography>
        </Box>
      )}
      
      {/* Content on bottom */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2, '&:last-child': { pb: 2 } }}>
        <Box>
          <Typography variant="h5" component="div" gutterBottom>
            {fields.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={fields.category} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
            {fields.strikePrice && fields.strikePrice > 0 && fields.price > 0 && (
              <Chip 
                label={`${Math.round(((fields.strikePrice - fields.price) / fields.strikePrice) * 100)}% OFF`} 
                size="small" 
                color="error" 
                variant="filled" 
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              ₹{fields.price}
            </Typography>
            {fields.strikePrice && fields.strikePrice > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ₹{fields.strikePrice}
              </Typography>
            )}
          </Box>

          {fields.testList && fields.testList.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {fields.testList.length} tests included
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={(e) => {
              e.stopPropagation()
              if (onKnowMore) onKnowMore()
            }}
          >
            Know More
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            onClick={(e) => {
              e.stopPropagation()
              if (onBookNow) onBookNow()
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}




