'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaOptionsType } from 'embla-carousel'

interface MultiItemCarouselProps {
  children: React.ReactNode[]
  autoplay?: boolean
  autoplayInterval?: number
  itemGap?: number
  flat?: boolean
  sidePadding?: number
  // Embla option passthroughs
  loop?: boolean
  align?: EmblaOptionsType['align']
  dragFree?: boolean
  containScroll?: EmblaOptionsType['containScroll']
  duration?: number
  startIndex?: number
  showDots?: boolean
  prevAriaLabel?: string
  nextAriaLabel?: string
}

export const MultiItemCarousel: React.FC<MultiItemCarouselProps> = ({
  children,
  autoplay = true,
  autoplayInterval = 4000,
  itemGap = 24,
  flat = true,
  sidePadding = itemGap,
  loop = true,
  align = 'start',
  dragFree = false,
  containScroll = 'trimSnaps',
  duration = 25,
  startIndex,
  showDots = false,
  prevAriaLabel = 'Previous',
  nextAriaLabel = 'Next',
}) => {
  const options: EmblaOptionsType = useMemo(() => ({
    loop,
    align,
    dragFree,
    containScroll,
    duration,
    slidesToScroll: 1,
    ...(typeof startIndex === 'number' ? { startIndex } : {}),
  }), [loop, align, dragFree, containScroll, duration, startIndex])

  const plugins = useMemo(() => {
    if (!autoplay) return undefined
    return [
      Autoplay({
        delay: autoplayInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
      })
    ]
  }, [autoplay, autoplayInterval])

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins as any)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [emblaApi, onSelect])

  // Autoplay handled by plugin above

  if (!children || children.length === 0) {
    return null
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: `${itemGap}px`, px: `${sidePadding}px`, willChange: 'transform', transform: 'translateZ(0)' }}>
          {React.Children.map(children, (child, index) => {
            const isNext = (selectedIndex + 1) % React.Children.count(children) === index
            const loadingPriority = index === 0 || isNext ? 'eager' : 'lazy'
            return (
              <Box
                sx={{
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  width: {
                    xs: `calc((100% - ${itemGap}px) / 1)`,
                    sm: `calc((100% - ${itemGap * 2}px) / 2)`,
                    md: `calc((100% - ${itemGap * 3}px) / 3)`,
                    lg: `calc((100% - ${itemGap * 4}px) / 4)`,
                  },
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
              >
                {React.isValidElement(child) ? (() => {
                  const type: any = (child as any).type
                  const typeName = type?.displayName || type?.name || ''
                  const canAccept = ['FacilityCard', 'DoctorTileCard'].includes(typeName)
                  return canAccept ? React.cloneElement(child as any, { loadingPriority }) : child
                })() : child}
              </Box>
            )
          })}
        </Box>
      </Box>

      {children.length > 1 && (
        <>
          <IconButton
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!emblaApi || !canScrollPrev}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
              '&:focus-visible': {
                boxShadow: '0 0 0 3px rgba(25,118,210,0.35), 0 8px 18px rgba(0,0,0,0.22)'
              }
            }}
            aria-label={prevAriaLabel}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={() => emblaApi?.scrollNext()}
            disabled={!emblaApi || !canScrollNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
              '&:focus-visible': {
                boxShadow: '0 0 0 3px rgba(25,118,210,0.35), 0 8px 18px rgba(0,0,0,0.22)'
              }
            }}
            aria-label={nextAriaLabel}
          >
            <NavigateNextIcon />
          </IconButton>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0,0,0,0.06)',
            borderRadius: 16,
            p: 0.5,
            px: 1,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          {scrollSnaps.map((_, index) => (
            <Box
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              role="button"
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  emblaApi?.scrollTo(index)
                }
              }}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: selectedIndex === index ? 'primary.main' : 'rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default MultiItemCarousel


