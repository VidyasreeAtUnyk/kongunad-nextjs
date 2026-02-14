'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Box, Dialog, IconButton, Link as MuiLink, Button, Skeleton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { CampaignPoster as CampaignPosterType } from '@/types/contentful'

interface CampaignPosterProps {
  poster?: CampaignPosterType | null
}

export const CampaignPoster: React.FC<CampaignPosterProps> = ({ poster }) => {
  const [open, setOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!poster || !poster.fields.active) {
      return
    }

    // Check if poster has been shown in this session
    const sessionKey = `campaign_poster_${poster.sys.id}_shown`
    const hasBeenShown = sessionStorage.getItem(sessionKey)

    if (!hasBeenShown) {
      // Open immediately - no delay needed
      setOpen(true)
      sessionStorage.setItem(sessionKey, 'true')
    }
  }, [poster])

  // Reset image loading state when dialog opens
  useEffect(() => {
    if (open) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [open])

  // Check if image is already loaded (e.g., from cache) after dialog opens
  useEffect(() => {
    if (!open || !imgRef.current) {
      return
    }

    const checkImageLoaded = () => {
      if (imgRef.current) {
        // If image is complete and has dimensions, it loaded successfully
        if (imgRef.current.complete && imgRef.current.naturalHeight > 0) {
          setImageLoading(false)
          setImageError(false)
        }
        // Only mark as error if image is complete but has no dimensions (actual error)
        else if (imgRef.current.complete && imgRef.current.naturalHeight === 0 && imgRef.current.naturalWidth === 0) {
          setImageLoading(false)
          setImageError(true)
        }
      }
    }
    
    // Check immediately and also after a short delay
    checkImageLoaded()
    const timeout = setTimeout(checkImageLoaded, 50)
    
    return () => clearTimeout(timeout)
  }, [open])

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
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: 1, // Square aspect ratio
                  overflow: 'hidden',
                  backgroundColor: 'grey.200',
                }}
              >
                {imageLoading && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                  />
                )}
                {!imageError && (
                  <Box
                    component="img"
                    ref={imgRef}
                    src={fullImageUrl}
                    alt="Campaign poster"
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => {
                      setImageLoading(false)
                      setImageError(false)
                    }}
                    onError={() => {
                      setImageLoading(false)
                      setImageError(true)
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: imageLoading ? 0 : 1,
                      transition: 'opacity 0.3s ease-in-out',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
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
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: 1, // Square aspect ratio
                  overflow: 'hidden',
                  backgroundColor: 'grey.200',
                }}
              >
                {imageLoading && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                  />
                )}
                {!imageError && (
                  <Box
                    component="img"
                    ref={imgRef}
                    src={fullImageUrl}
                    alt="Campaign poster"
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => {
                      setImageLoading(false)
                      setImageError(false)
                    }}
                    onError={() => {
                      setImageLoading(false)
                      setImageError(true)
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      cursor: 'pointer',
                      opacity: imageLoading ? 0 : 1,
                      transition: 'opacity 0.3s ease-in-out',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            </MuiLink>
          ) : (
            // No link, just show image
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: 1, // Square aspect ratio
                overflow: 'hidden',
                backgroundColor: 'grey.200',
              }}
            >
              {imageLoading && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                />
              )}
              {!imageError && (
                <Box
                  component="img"
                  ref={imgRef}
                  src={fullImageUrl}
                  alt="Campaign poster"
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => {
                    setImageLoading(false)
                    setImageError(false)
                  }}
                  onError={() => {
                    setImageLoading(false)
                    setImageError(true)
                  }}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

