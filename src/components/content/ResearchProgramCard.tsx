'use client'

import React, { memo, useCallback, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material'
import { ResearchProgram } from '@/types/contentful'
import SchoolIcon from '@mui/icons-material/School'

interface ResearchProgramCardProps {
  program: ResearchProgram
  onApply?: () => void
  onLearnMore?: () => void
}

export const ResearchProgramCard: React.FC<ResearchProgramCardProps> = memo(({
  program,
  onApply,
  onLearnMore,
}) => {
  // Validate program data
  if (!program || !program.fields) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Program information unavailable
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const { fields } = program
  const title = fields.title || 'Untitled Program'
  const description = fields.shortDescription || fields.description || 'No description available.'
  const iconUrl = fields.icon?.fields?.file?.url
  const [imageError, setImageError] = useState(false)

  const handleLearnMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onLearnMore) {
      onLearnMore()
    }
  }, [onLearnMore])

  const handleApplyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onApply) {
      onApply()
    }
  }, [onApply])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

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
    >
      {/* Icon on top - left aligned */}
      {iconUrl && !imageError ? (
        <Box
          sx={{
            width: 'auto',
            height: 80,
            backgroundColor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            p: 2,
          }}
        >
          <Box
            component="img"
            src={`https:${iconUrl}`}
            alt={title}
            loading="lazy"
            onError={handleImageError}
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
            backgroundColor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            color: 'primary.contrastText',
            pl: 2,
          }}
        >
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Box>
      )}

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
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>

          {fields.duration && (
            <Chip
              label={fields.duration}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
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
            }}
          >
            {description}
          </Typography>

          {fields.active === false && (
            <Chip
              label="Not Currently Accepting Applications"
              size="small"
              color="default"
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {onLearnMore && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleLearnMoreClick}
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
            >
              Apply Now
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.program?.sys?.id === nextProps.program?.sys?.id &&
    prevProps.program?.fields?.active === nextProps.program?.fields?.active
  )
})

ResearchProgramCard.displayName = 'ResearchProgramCard'

