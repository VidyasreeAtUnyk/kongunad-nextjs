import React from 'react'
import { Box, Button, Container, Typography, Skeleton } from '@mui/material'
import MultiItemCarousel from '@/components/ui/MultiItemCarousel'
import { FacilityCard } from '@/components/content/FacilityCard'
import { Facility } from '@/types/contentful'

interface FacilitiesSectionProps {
  facilities: Facility[]
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ facilities }) => {
  const isEmpty = !facilities || facilities.length === 0
  return (
    <Box component="section" sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h2" color="primary">
            Facilities
          </Typography>
          <Button variant="outlined" href="/facilities">
            View All
          </Button>
        </Box>

        {isEmpty ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4].map((i) => (
              <Skeleton 
                key={i}
                variant="rounded" 
                animation="wave" 
                sx={{ 
                  flex: '0 0 auto',
                  width: {
                    xs: `calc((100% - ${2 * 1}px) / 1)`,
                    sm: `calc((100% - ${2 * 2}px) / 2)`,
                    md: `calc((100% - ${2 * 3}px) / 3)`,
                    lg: `calc((100% - ${2 * 4}px) / 4)`,
                  },
                  height: { xs: 220, sm: 240, md: 260 }, 
                  borderRadius: 2 
                }} 
              />
            ))}
          </Box>
        ) : (
          <MultiItemCarousel 
            autoplay 
            itemGap={16}
            sidePadding={16}
            prevAriaLabel="Previous facilities"
            nextAriaLabel="Next facilities"
          >
            {facilities.map((facility) => (
              <FacilityCard key={facility.sys.id} facility={facility} />
            ))}
          </MultiItemCarousel>
        )}
      </Container>
    </Box>
  )
}

export default FacilitiesSection


