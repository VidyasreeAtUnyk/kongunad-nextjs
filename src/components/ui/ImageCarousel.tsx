'use client'

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { Box, IconButton, Skeleton, Typography } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaOptionsType } from 'embla-carousel'

interface CarouselImageObject {
  src: string
  alt?: string
}

type CarouselImage = string | CarouselImageObject

interface ImageCarouselProps {
  images: CarouselImage[]
  autoplay?: boolean
  autoplayInterval?: number
  maxWidth?: string
  height?: string | { xs?: string; md?: string }
  fit?: 'cover' | 'contain'
  flat?: boolean
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoplay = true,
  autoplayInterval = 3000,
  maxWidth = '100%',
  height = '400px',
  fit = 'cover',
  flat = false,
}) => {
  const options: EmblaOptionsType = useMemo(() => ({
    // LOOP: Enable infinite scrolling (slides wrap around)
    // Values: true | false
    // true = slides loop infinitely (1→2→3→1→2...)
    // false = stops at first/last slide
    // Always enable loop for autoplay to work properly
    loop: true,
    
    // ALIGN: How slides align within the carousel viewport
    // Values: 'start' | 'center' | 'end' | number (0-1)
    // 'start' = slides align to the left edge
    // 'center' = slides center in viewport
    // 'end' = slides align to the right edge
    // number = custom alignment (0=start, 0.5=center, 1=end)
    align: 'start',
    
    // DRAG_FREE: Allow free-form dragging vs snap-to-slide behavior
    // Values: true | false
    // true = smooth free dragging (like momentum scrolling)
    // false = snaps to nearest slide when drag ends
    dragFree: false,
    
    // CONTAIN_SCROLL: How to handle scroll boundaries
    // Values: 'trimSnaps' | 'keepSnaps' | false
    // 'trimSnaps' = removes snap points that would cause empty space
    // 'keepSnaps' = keeps all snap points even if they show empty space
    // false = no scroll containment
    containScroll: 'trimSnaps',
    
    // SKIP_SNAPS: Whether to skip certain snap points
    // Values: true | false | function
    // true = skips snap points that would cause empty space
    // false = uses all snap points
    // function = custom logic to determine which snaps to skip
    skipSnaps: false,
    
    // DURATION: Animation duration for transitions (in milliseconds)
    // Values: number (0-∞)
    // Lower = faster transitions (more responsive)
    // Higher = slower transitions (more smooth)
    // Fast transitions for responsive feel
    duration: 20,
    
    // Additional useful options you can add:
    
    // // START_INDEX: Which slide to show initially
    // // Values: number (0-based index)
    // startIndex: 0,
    
    // // AXIS: Scroll direction
    // // Values: 'x' | 'y'
    // // 'x' = horizontal scrolling (default)
    // // 'y' = vertical scrolling
    // axis: 'x',
    
    // // DIRECTION: Scroll direction
    // // Values: 'ltr' | 'rtl'
    // // 'ltr' = left to right (default)
    // // 'rtl' = right to left
    // direction: 'ltr',
    
    // // IN_VIEW_THRESHOLD: How much of a slide must be visible to trigger events
    // // Values: number (0-1)
    // // 0 = slide must be completely visible
    // // 0.5 = slide must be 50% visible
    // // 1 = slide just needs to enter viewport
    // inViewThreshold: 0.7,
    
    // // DRAG_THRESHOLD: Minimum drag distance before dragging starts
    // // Values: number (pixels)
    // // Higher = requires more drag to start
    // // Lower = more sensitive to small movements
    // dragThreshold: 10,
    
    // // WATCH_DRAG: Whether to watch for drag gestures
    // // Values: true | false
    // // true = enables touch/mouse drag
    // // false = disables drag (only buttons work)
    // watchDrag: true,
    
    // // WATCH_RESIZE: Whether to watch for container resize
    // // Values: true | false
    // // true = recalculates on resize (responsive)
    // // false = static sizing
    // watchResize: true,
    
    // // WATCH_SCROLL: Whether to watch for scroll events
    // // Values: true | false
    // // true = enables scroll wheel navigation
    // // false = disables scroll wheel
    // watchScroll: true,
  }), [])
  
  // Create autoplay plugin with our props
  const autoplayPlugin = useMemo(() => {
    if (!autoplay) return undefined
    return Autoplay({ 
      delay: autoplayInterval, 
      stopOnInteraction: false,     // Don't stop permanently on interaction
      stopOnMouseEnter: true,       // Pause on hover
      stopOnFocusIn: false,         // Keep playing when focused (accessibility)
    })
  }, [autoplay, autoplayInterval])
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options, autoplayPlugin ? [autoplayPlugin] : undefined)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const preloadedRef = useRef<Set<number>>(new Set())

  const getOptimizedUrl = useCallback((url: string, width: number = 1600, quality: number = 70) => {
    try {
      // Only optimize known Contentful asset URLs
      const isContentful = url.includes('images.ctfassets.net') || url.includes('assets.ctfassets.net')
      const isProtocolRelative = url.startsWith('//')
      let absoluteUrl = isProtocolRelative ? `https:${url}` : url
      // Normalize protocol for Contentful to https
      if (isContentful && absoluteUrl.startsWith('http:')) {
        absoluteUrl = absoluteUrl.replace('http:', 'https:')
      }
      if (isContentful) {
        const u = new URL(absoluteUrl)
        // Clamp sensible bounds
        const clampedW = Math.max(400, Math.min(2000, Math.floor(width)))
        const clampedQ = Math.max(50, Math.min(85, Math.floor(quality)))
        // Preserve any existing params set upstream; only add if missing
        if (!u.searchParams.has('fm')) u.searchParams.set('fm', 'webp')
        if (!u.searchParams.has('q')) u.searchParams.set('q', String(clampedQ))
        if (!u.searchParams.has('w')) u.searchParams.set('w', String(clampedW))
        return u.toString()
      }
      return absoluteUrl
    } catch {
      return url
    }
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }, [])

  const handleImageError = useCallback((index: number) => {
    console.warn(`Failed to load image at index ${index}`)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
    
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Preload neighbor slides to avoid lag when moving next/prev
  useEffect(() => {
    if (!images || images.length === 0) return
    const neighbors = [
      (selectedIndex + 1) % images.length,
      (selectedIndex - 1 + images.length) % images.length,
    ]
    neighbors.forEach((idx) => {
      if (preloadedRef.current.has(idx)) return
      const raw = images[idx]
      const url = typeof raw === 'string' ? raw : raw.src
      const src = getOptimizedUrl(url)
      const img = new Image()
      img.src = src
      preloadedRef.current.add(idx)
    })
  }, [images, selectedIndex, getOptimizedUrl])

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed rgba(255,255,255,0.3)',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            No images available
          </Typography>
          <Typography variant="caption">
            Please add images to display the carousel
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{ 
        position: 'relative', 
        maxWidth, 
        height, 
        borderRadius: flat ? 0 : 3, 
        overflow: 'hidden',
        boxShadow: flat ? 'none' : '0 8px 32px rgba(0,0,0,0.12)',
        transition: flat ? 'none' : 'transform 0.3s ease-in-out',
        '&:hover': flat ? {} : {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }
      }}
    >
      <Box ref={emblaRef} sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {images.map((rawImage, index) => {
            const rawSrc = typeof rawImage === 'string' ? rawImage : rawImage.src
            const alt = typeof rawImage === 'string' ? `Slide ${index + 1}` : (rawImage.alt || `Slide ${index + 1}`)
            const image = getOptimizedUrl(rawSrc)
            const isNext = (selectedIndex + 1) % images.length === index
            const fetchPriority = index === 0 ? 'high' : (isNext ? 'high' : 'auto')
            return (
            <Box key={index} sx={{ position: 'relative', flex: '0 0 100%', height: '100%' }}>
              {!loadedImages.has(index) && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
                />
              )}
              <img
                src={image}
                alt={alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                {...({ fetchPriority } as any)}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: fit, 
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
            </Box>
          )})}
        </Box>
      </Box>

      {images.length > 1 && (
        <>
          <IconButton
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!emblaApi}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: 'rgba(0,0,0,0.8)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              '&:disabled': {
                bgcolor: 'rgba(0,0,0,0.3)',
                color: 'rgba(255,255,255,0.5)',
              },
              zIndex: 2,
            }}
            aria-label="Previous image"
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={() => emblaApi?.scrollNext()}
            disabled={!emblaApi}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: 'rgba(0,0,0,0.8)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              '&:disabled': {
                bgcolor: 'rgba(0,0,0,0.3)',
                color: 'rgba(255,255,255,0.5)',
              },
              zIndex: 2,
            }}
            aria-label="Next image"
          >
            <NavigateNextIcon />
          </IconButton>
        </>
      )}

      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            bgcolor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            p: 1,
            zIndex: 2,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: selectedIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedIndex === index ? '2px solid white' : '2px solid transparent',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.2)',
                },
              }}
              aria-label={`Go to slide ${index + 1}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  emblaApi?.scrollTo(index)
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

