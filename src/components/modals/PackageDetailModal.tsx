'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Chip,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { HealthPackage, TestGroup } from '@/types/contentful'

interface PackageDetailModalProps {
  packageId: string
  open: boolean
  onClose: () => void
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  packageId,
  open,
  onClose,
}) => {
  const router = useRouter()
  const [healthPackage, setHealthPackage] = useState<HealthPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && packageId) {
      fetchPackage()
    } else {
      setHealthPackage(null)
      setLoading(false)
      setError(null)
    }
  }, [open, packageId])

  const fetchPackage = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/packages/${packageId}`)
      
      if (!response.ok) {
        throw new Error('Package not found')
      }
      
      const entry = await response.json()
      setHealthPackage(entry as unknown as HealthPackage)
    } catch (err) {
      console.error('Error fetching package:', err)
      setError('Failed to load package details')
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscount = () => {
    if (!healthPackage) return 0
    if (healthPackage.fields.discount) {
      return healthPackage.fields.discount
    }
    if (healthPackage.fields.strikePrice && healthPackage.fields.price) {
      const discount = healthPackage.fields.strikePrice - healthPackage.fields.price
      return Math.round((discount / healthPackage.fields.strikePrice) * 100)
    }
    return 0
  }

  const getTestCount = () => {
    if (!healthPackage?.fields.testList) return 0
    let count = 0
    healthPackage.fields.testList.forEach((item) => {
      if (typeof item === 'string') {
        count++
      } else {
        count += item.tests.length
      }
    })
    return count
  }

  const handleBookNow = () => {
    if (healthPackage) {
      router.push('/book-a-checkup/')
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: { xs: '95vw', md: '800px' },
          height: { xs: '90vh', md: '75vh' },
          maxHeight: { xs: '90vh', md: '85vh' },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8, minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button onClick={fetchPackage} sx={{ mt: 2 }} variant="outlined">
            Retry
          </Button>
        </Box>
      ) : healthPackage ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Header with title and close button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            p: 2, 
            pb: 1, 
            position: 'relative',
            flexShrink: 0,
          }}>
            <Typography variant="h3" sx={{ fontWeight: 600, textAlign: 'center', color: 'primary.main' }}>
              {healthPackage.fields.title}
            </Typography>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ position: 'absolute', right: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Content - Two Column Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            p: { xs: 2, md: 3 },
            gap: 3,
            flex: 1,
            overflow: 'hidden',
            minHeight: 0,
          }}>
            {/* Left Column - Tests */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 65%' },
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: { md: 2 },
              minHeight: 0,
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tests Included ({getTestCount()})
              </Typography>
              <Box>
                {healthPackage.fields.testList?.map((item, index) => {
                  if (typeof item === 'string') {
                    return (
                      <Box key={index} sx={{ py: 1, pl: 2, borderLeft: '2px solid', borderColor: 'primary.main', mb: 1 }}>
                        <Typography variant="body1">{item}</Typography>
                      </Box>
                    )
                  } else {
                    return (
                      <Accordion 
                        key={index} 
                        sx={{ 
                          mb: 1,
                          boxShadow: 'none',
                          border: 'none',
                          borderLeft: '2px solid',
                          borderColor: 'primary.main',
                          '&:before': {
                            display: 'none',
                          },
                          '&.Mui-expanded': {
                            margin: '0 0 8px 0',
                          },
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            px: 1,
                            py: 1,
                            minHeight: '40px',
                            '&.Mui-expanded': {
                              minHeight: '40px',
                            },
                            '& .MuiAccordionSummary-content': {
                              margin: '8px 0',
                              '&.Mui-expanded': {
                                margin: '8px 0',
                              },
                            },
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {item.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 1, py: 1 }}>
                          <Box sx={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}>
                            {item.tests.map((test, testIndex) => (
                              <Typography 
                                key={testIndex} 
                                variant="body2" 
                                sx={{ 
                                  display: 'inline-block',
                                  px: 1,
                                  py: 0.5,
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                  fontSize: '0.85rem',
                                }}
                              >
                                {test}
                              </Typography>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )
                  }
                })}
              </Box>
            </Box>

            {/* Right Column - Info */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '0 0 35%' },
              display: 'flex',
              flexDirection: 'column',
              maxWidth: { md: '280px' },
              alignSelf: 'flex-start',
              overflowY: 'auto',
              overflowX: 'hidden',
              minHeight: 0,
            }}>
              {/* Category Badge */}
              {/* {healthPackage.fields.category && (
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={healthPackage.fields.category} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )} */}

              {/* Description */}
              {/* {healthPackage.fields.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {healthPackage.fields.description}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} /> */}

              {/* Notes */}
              {healthPackage.fields.notes && healthPackage.fields.notes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    Important Notes
                  </Typography>
                  {healthPackage.fields.notes.map((note, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{note}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Special Notes (Italic) */}
              {healthPackage.fields.special && healthPackage.fields.special.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    Special Offers
                  </Typography>
                  {healthPackage.fields.special.map((special, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1.5, bgcolor: 'primary.50', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'primary.dark', fontSize: '0.875rem' }}>
                        {special}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Price Card */}
              <Paper sx={{ 
                p: 2.5, 
                mb: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}>
                {healthPackage.fields.strikePrice && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" component="span">
                        MRP{' '}
                        <Typography 
                          component="span" 
                          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                        >
                          ₹{healthPackage.fields.strikePrice.toLocaleString()}
                        </Typography>
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      {calculateDiscount()}% off
                    </Typography>
                  </Box>
                )}
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  ₹{healthPackage.fields.price.toLocaleString()}
                </Typography>
              </Paper>

              {/* Book Now Button */}
              <Button
                variant="contained"
                size="medium"
                fullWidth
                onClick={handleBookNow}
                sx={{
                  py: 1.25,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Dialog>
  )
}
