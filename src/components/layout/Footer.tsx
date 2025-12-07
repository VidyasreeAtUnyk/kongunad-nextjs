import React from 'react'
import { Box, Container, Typography, Link as MuiLink, Button, Divider, IconButton } from '@mui/material'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FacebookIcon from '@mui/icons-material/Facebook'

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ mt: 8 }}>
      {/* Secondary band - contact quick info */}
      <Box sx={{ bgcolor: 'info.main' }}>
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 800 }}>KONGUNAD HOSPITALS</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4, flex: 1, justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexShrink: 0 }}>
              <LocalPhoneIcon sx={{ color: 'secondary.main' }} />
              <Box sx={{ color: 'text.primary' }}>
                <Typography variant="body2">0422 431 6000</Typography>
                <Typography variant="body2">0422 431 6001</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              <MailOutlineIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="body2">kongunad@gmail.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, maxWidth: 420, flexBasis: 420 }}>
              <PlaceOutlinedIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                Kongunad Hospitals, 11th Street, Tatabad, Gandhipuram, Coimbatore, Tamil Nadu 641012
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Primary band - links and app */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'common.white', position: 'relative' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 240px' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Your health is our priority</Typography>
            </Box>
            <Box sx={{ flex: '2 1 480px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Overview</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <MuiLink href="/about-us" color="inherit" underline="hover">About us</MuiLink>
                  <MuiLink href="/facilities" color="inherit" underline="hover">Facilities</MuiLink>
                  <MuiLink href="/find-a-doctor" color="inherit" underline="hover">Find a Doctor</MuiLink>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Engagement</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <MuiLink href="#" color="inherit" underline="hover">Social activities</MuiLink>
                  <MuiLink href="#" color="inherit" underline="hover">Job vacancies</MuiLink>
                  <MuiLink href="/contact-us" color="inherit" underline="hover">Contact Us</MuiLink>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Services</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <MuiLink href="/book-a-health-checkup" color="inherit" underline="hover">Book a Health checkup</MuiLink>
                  <MuiLink href="/book-appointment" color="inherit" underline="hover">Make an Appointment</MuiLink>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: '1 1 160px', display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'flex-start' }}>
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
                href="https://play.google.com/store/apps/details?id=com.aes.kongunaduhospital&hl=en&pli=1"
                sx={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: 'common.white',
                  textTransform: 'none',
                }}
              >
                Download our app
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption">© {new Date().getFullYear()} Kongunad Hospitals. All rights reserved.</Typography>
              <IconButton
                component="a"
                href="https://www.facebook.com/kongunad"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    color: 'common.white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                aria-label="Visit our Facebook page"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href="#" color="inherit" underline="hover" variant="caption">Privacy</MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" variant="caption">Terms</MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Footer


