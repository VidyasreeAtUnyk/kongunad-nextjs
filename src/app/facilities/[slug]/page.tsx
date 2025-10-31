import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { getFacilitiesCached } from '@/lib/contentful'
import { Facility } from '@/types/contentful'

interface FacilityPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const facilities = await getFacilitiesCached() as unknown as Facility[]
    const facility = facilities.find(f => 
      f.fields.name.toLowerCase().replace(/\s+/g, '-') === slug
    )

    if (!facility) {
      return {
        title: 'Facility Not Found - Kongunad Hospital',
      }
    }

    return {
      title: `${facility.fields.name} - Kongunad Hospital`,
      description: facility.fields.description,
    }
  } catch (error) {
    return {
      title: 'Facility - Kongunad Hospital',
      description: 'Hospital facility information',
    }
  }
}

export async function generateStaticParams() {
  try {
    const facilities = await getFacilitiesCached() as unknown as Facility[]
    
    return facilities.map((facility) => ({
      slug: facility.fields.name.toLowerCase().replace(/\s+/g, '-'),
    }))
  } catch (error) {
    console.log('Contentful not configured, returning empty static params')
    return []
  }
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  try {
    const { slug } = await params
    const facilities = await getFacilitiesCached() as unknown as Facility[]
    const facility = facilities.find(f => 
      f.fields.name.toLowerCase().replace(/\s+/g, '-') === slug
    )

    if (!facility) {
      notFound()
    }

    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">
              Home
            </Link>
            <Link href="/facilities" color="inherit">
              Facilities
            </Link>
            <Typography color="text.primary">{facility.fields.name}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Facility Image */}
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent sx={{ p: 0 }}>
                  <Box
                    component="img"
                    src={`https:${facility.fields.icon.fields.file.url}`}
                    alt={facility.fields.name}
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'cover',
                    }}
                  />
                </CardContent>
              </Card>
            </Box>

            {/* Facility Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h1" gutterBottom color="primary">
                {facility.fields.name}
              </Typography>
              
              <Chip 
                label={facility.fields.category} 
                color="primary" 
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                {facility.fields.description}
              </Typography>

            {/* Services section - commented out as not needed in Contentful
            {facility.fields.services && facility.fields.services.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Services Offered:
                </Typography>
                <List>
                  {facility.fields.services.map((service, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={service} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            */}
            </Box>
          </Box>

          {/* Additional Images */}
          {facility.fields.images && facility.fields.images.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom>
                Gallery
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {facility.fields.images.map((image, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 14px)' } }}>
                    <Card>
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          component="img"
                          src={`https:${image.fields.file.url}`}
                          alt={image.fields.title}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    )
  } catch (error) {
    notFound()
  }
}
