'use client'

import React, { useEffect, useState } from 'react'
import { Box, Dialog, IconButton, Link as MuiLink, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { CampaignPoster as CampaignPosterType } from '@/types/contentful'

interface CampaignPosterProps {
  poster?: CampaignPosterType | null
}

export const CampaignPoster: React.FC<CampaignPosterProps> = ({ poster }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!poster || !poster.fields.active) {
      return
    }

    // Check if poster has been shown in this session
    const sessionKey = `campaign_poster_${poster.sys.id}_shown`
    const hasBeenShown = sessionStorage.getItem(sessionKey)

    if (!hasBeenShown) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setOpen(true)
        sessionStorage.setItem(sessionKey, 'true')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [poster])

  const handleClose = () => {
    setOpen(false)
  }

  if (!poster || !poster.fields.active || !poster.fields.image) {
    return null
  }

  const imageUrl = poster.fields.image.fields?.file?.url
  if (!imageUrl) {
    return null
  }

  const fullImageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
      sx={{
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'common.white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
          aria-label="Close campaign poster"
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* If both link and linkText are present, show image without link and add button below */}
          {poster.fields.link && poster.fields.linkText ? (
            <>
              <Box
                component="img"
                src={fullImageUrl}
                alt="Campaign poster"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                }}
              >
                <Button
                  component="a"
                  href={poster.fields.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  {poster.fields.linkText}
                </Button>
              </Box>
            </>
          ) : poster.fields.link ? (
            // If only link is present (no linkText), make entire image clickable
            <MuiLink
              href={poster.fields.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src={fullImageUrl}
                alt="Campaign poster"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  cursor: 'pointer',
                }}
              />
            </MuiLink>
          ) : (
            // No link, just show image
            <Box
              component="img"
              src={fullImageUrl}
              alt="Campaign poster"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

