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
}

export const HealthPackageCard: React.FC<HealthPackageCardProps> = ({ 
  healthPackage, 
  onClick 
}) => {
  const { fields } = healthPackage
  
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
      {fields.icon?.fields?.file?.url ? (
        <CardMedia
          component="img"
          height="150"
          image={`https:${fields.icon.fields.file.url}`}
          alt={fields.title}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 150,
            backgroundColor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6">No Image</Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {fields.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {fields.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Includes {fields.testList.length} tests:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {fields.testList.slice(0, 3).map((test, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText 
                    primary={typeof test === 'string' ? test : test.title}
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {fields.testList.length > 3 && (
                <ListItem sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`+${fields.testList.length - 3} more tests`}
                    primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        {fields.notes && fields.notes.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Important Notes:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {fields.notes.slice(0, 2).map((note, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`• ${note}`}
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {fields.notes.length > 2 && (
                <ListItem sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`+${fields.notes.length - 2} more notes`}
                    primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        {fields.special && fields.special.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="primary" gutterBottom>
              Special Features:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {fields.special.slice(0, 1).map((special, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`• ${special}`}
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {fields.special.length > 1 && (
                <ListItem sx={{ py: 0 }}>
                  <ListItemText 
                    primary={`+${fields.special.length - 1} more features`}
                    primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation()
            // Handle booking logic
          }}
        >
          Book Package
        </Button>
      </CardContent>
    </Card>
  )
}




