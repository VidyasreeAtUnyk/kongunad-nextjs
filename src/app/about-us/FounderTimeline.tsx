'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Typography, Paper } from '@mui/material'

interface TimelineItem {
  year: string
  text: string
}

interface FounderTimelineProps {
  items: TimelineItem[]
}

export const FounderTimeline: React.FC<FounderTimelineProps> = React.memo(({ items }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleIntersection = useCallback((index: number) => {
    setVisibleItems((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleIntersection(index)
            }
          })
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      observer.observe(ref)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [handleIntersection, items.length])

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          pl: { xs: 0, md: 3 },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: { xs: 20, md: 120 },
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: 'primary.main',
            opacity: 0.3,
          },
        }}
      >
        {items.map((item, index) => {
          const isVisible = visibleItems.has(index)

          return (
            <Box
              key={index}
              ref={(el: HTMLDivElement | null) => {
                itemRefs.current[index] = el
              }}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: { xs: 'flex-start', md: 'center' },
                position: 'relative',
                opacity: isVisible ? 1 : 0.4,
                transform: isVisible
                  ? 'translateX(0) translateY(0)'
                  : 'translateX(-30px) translateY(10px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Year - Always on the left */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', md: '0 0 120px' },
                  textAlign: { xs: 'left', md: 'right' },
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    bgcolor: isVisible ? 'primary.main' : 'grey.400',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    transition: 'background-color 0.3s ease',
                    boxShadow: isVisible ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
                  }}
                >
                  {item.year}
                </Typography>
              </Box>

              {/* Content - Always on the right */}
              <Box
                sx={{
                  flex: 1,
                  position: 'relative',
                  pl: { xs: 0, md: 2 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: isVisible ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: isVisible ? 'primary.light' : 'divider',
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  if (prevProps.items.length !== nextProps.items.length) return false
  return prevProps.items.every((item, index) => 
    item.year === nextProps.items[index]?.year && 
    item.text === nextProps.items[index]?.text
  )
})

FounderTimeline.displayName = 'FounderTimeline'

