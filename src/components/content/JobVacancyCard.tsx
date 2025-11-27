'use client'

import React, { memo, useCallback } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import { JobVacancy } from '@/types/contentful'
import WorkIcon from '@mui/icons-material/Work'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'

interface JobVacancyCardProps {
  job: JobVacancy
  onApply?: () => void
  onLearnMore?: () => void
}

export const JobVacancyCard: React.FC<JobVacancyCardProps> = memo(({
  job,
  onApply,
  onLearnMore,
}) => {
  // Validate job data
  if (!job || !job.fields) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Job information unavailable
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const { fields } = job
  const title = fields.title || 'Untitled Position'
  const description = fields.shortDescription || fields.description || 'No description available.'

  const handleApplyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onApply) {
      onApply()
    }
  }, [onApply])

  const handleLearnMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onLearnMore) {
      onLearnMore()
    }
  }, [onLearnMore])

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderColor: 'primary.main',
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Header Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}
          >
            <WorkIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            {fields.department && (
              <Chip
                label={fields.department}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        <Box>
          {/* Job Details Grid */}
          {(fields.location || fields.experience || fields.employmentType || fields.salaryRange) && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                mb: 2.5,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2,
              }}
            >
              {fields.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    {fields.location}
                  </Typography>
                </Box>
              )}
              {fields.experience && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    {fields.experience}
                  </Typography>
                </Box>
              )}
              {fields.employmentType && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessCenterIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    {fields.employmentType}
                  </Typography>
                </Box>
              )}
              {fields.salaryRange && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600, fontSize: '0.813rem' }}>
                    {fields.salaryRange}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>

          {fields.active === false && (
            <Chip
              label="Position Closed"
              size="small"
              color="default"
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          {onLearnMore && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleLearnMoreClick}
              sx={{
                py: 1.25,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Learn More
            </Button>
          )}
          {onApply && (
            <Button
              variant="contained"
              fullWidth
              disabled={fields.active === false}
              onClick={handleApplyClick}
              sx={{
                py: 1.25,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {fields.active === false ? 'Position Closed' : 'Apply Now'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Compare job data and callback references
  return (
    prevProps.job?.sys?.id === nextProps.job?.sys?.id &&
    prevProps.job?.fields?.active === nextProps.job?.fields?.active &&
    prevProps.onApply === nextProps.onApply &&
    prevProps.onLearnMore === nextProps.onLearnMore
  )
})

JobVacancyCard.displayName = 'JobVacancyCard'

