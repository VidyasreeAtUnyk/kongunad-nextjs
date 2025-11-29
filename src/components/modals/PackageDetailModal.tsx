'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { openBottomSheet } from '@/store/bottomSheetSlice'
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { HealthPackage, TestGroup } from '@/types/contentful'

interface PackageDetailModalProps {
  packageId: string
  open: boolean
  onClose: () => void
  onBookNow?: () => void
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  packageId,
  open,
  onClose,
  onBookNow,
}) => {
  const dispatch = useAppDispatch()
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
      if (onBookNow) {
        onBookNow()
      } else {
        // Open bottom sheet via Redux
        dispatch(openBottomSheet({ packageName: healthPackage.fields.title }))
      }
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Header Skeleton */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            p: 2, 
            pb: 1, 
            position: 'relative',
            flexShrink: 0,
          }}>
            <Skeleton variant="text" width={250} height={40} sx={{ mx: 'auto' }} />
            <IconButton 
              disabled
              size="small"
              sx={{ position: 'absolute', right: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Content Skeleton - Two Column Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            p: { xs: 2, md: 3 },
            gap: 3,
            flex: 1,
            overflow: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
          }}>
            {/* Left Column - Tests Skeleton */}
            <Box sx={{ 
              flex: { xs: '0 1 auto', md: '1 1 65%' },
              overflow: 'visible',
              pr: { md: 2 },
            }}>
              <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
              <Box>
                {[1, 2, 3, 4].map((idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      mb: 1, 
                      pl: 2, 
                      borderLeft: '2px solid', 
                      borderColor: 'grey.200',
                      py: 1,
                    }}
                  >
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right Column - Info Skeleton */}
            <Box sx={{ 
              flex: { xs: '0 1 auto', md: '0 0 35%' },
              display: 'flex',
              flexDirection: 'column',
              maxWidth: { md: '280px' },
              alignSelf: { xs: 'stretch', md: 'flex-start' },
              overflow: 'visible',
            }}>
              {/* Notes Skeleton */}
              <Box sx={{ mb: 2 }}>
                <Skeleton variant="text" width={120} height={16} sx={{ mb: 1 }} />
                <Box sx={{ mb: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
                </Box>
              </Box>

              {/* Price Card Skeleton */}
              <Paper sx={{ 
                p: 2.5, 
                mb: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}>
                <Skeleton variant="text" width={100} height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={150} height={40} />
              </Paper>

              {/* Book Now Button Skeleton */}
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={48}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
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
            overflow: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            minHeight: 0,
          }}>
            {/* Left Column - Tests */}
            <Box sx={{ 
              flex: { xs: '0 1 auto', md: '1 1 65%' },
              overflow: 'visible',
              pr: { md: 2 },
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
              flex: { xs: '0 1 auto', md: '0 0 35%' },
              display: 'flex',
              flexDirection: 'column',
              maxWidth: { md: '280px' },
              alignSelf: { xs: 'stretch', md: 'flex-start' },
              overflow: 'visible',
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
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
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
                      <Typography variant="body2">{note}</Typography>
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
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'primary.dark' }}>
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
