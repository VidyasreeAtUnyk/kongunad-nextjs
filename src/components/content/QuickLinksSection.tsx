import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

type QuickLink = { title: string; to: string }

interface QuickLinksSectionProps {
  links: QuickLink[]
}

export const QuickLinksSection: React.FC<QuickLinksSectionProps> = ({ links }) => {
  return (
    <Box component="section" sx={{ py: { xs: 0, md: 6 }, display: { xs: 'none', md: 'block' } }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: { md: 6, lg: 9 } }}>
        {/* Rotated Title on desktop */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'secondary.main',
              fontWeight: 500,
              transform: 'rotate(270deg)',
              whiteSpace: 'nowrap',
            }}
          >
            QUICK LINKS
          </Typography>
        </Box>

        {/* Links */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              flexWrap: { sm: 'wrap', md: 'nowrap' },
            }}
          >
            {links.map((link, idx) => {
              // Pick an icon by title keywords
              const t = link.title.toLowerCase()
              const startIcon = t.includes('appointment') ? <CalendarTodayIcon sx={{ fontSize: 18 }} />
                : t.includes('doctor') ? <PersonSearchIcon sx={{ fontSize: 18 }} />
                : t.includes('checkup') ? <HealthAndSafetyIcon sx={{ fontSize: 18 }} />
                : t.includes('emergency') || t.includes('call') ? <LocalPhoneIcon sx={{ fontSize: 18 }} />
                : <ArrowForwardIosIcon sx={{ fontSize: 18 }} />

              return (
                <Button
                  key={`${link.to}-${idx}`}
                  href={link.to}
                  variant="text"
                  startIcon={startIcon}
                  endIcon={<ArrowForwardIosIcon className="ctaArrow" sx={{ fontSize: 18 }} />}
                  sx={{
                    // Glass pill styling
                    textDecoration: 'none',
                    px: 4,
                    py: 1.75,
                    borderRadius: 5,
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'secondary.main',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(38,45,111,0.18)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                    },
                    '& .MuiButton-startIcon': { mr: 1 },
                    '& .ctaArrow': {
                      opacity: 0,
                      transform: 'translateX(-3px)',
                      transition: 'transform 0.2s ease, opacity 0.2s ease'
                    },
                    '&:hover .ctaArrow': {
                      opacity: 1,
                      transform: 'translateX(3px)'
                    }
                  }}
                >
                  {link.title}
                </Button>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default QuickLinksSection


