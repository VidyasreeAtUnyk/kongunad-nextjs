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
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { getSpecialtyByTypeAndSlugCached } from '@/lib/contentful'
import { Specialty } from '@/types/contentful'

interface SpecialtyPageProps {
  params: Promise<{
    type: string
    slug: string
  }>
}

const TYPE_NAMES: Record<string, string> = {
  'medical-specialties': 'Medical Specialties',
  'surgical-specialties': 'Surgical Specialties',
}

export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  try {
    const { type, slug } = await params
    const contentType = type === 'medical-specialties' ? 'medical' : 
                       type === 'surgical-specialties' ? 'surgical' : null
    
    if (!contentType) {
      return {
        title: 'Specialty Not Found - Kongunad Hospital',
      }
    }

    const specialty = await getSpecialtyByTypeAndSlugCached(contentType, slug) as unknown as Specialty | null

    if (!specialty) {
      return {
        title: 'Specialty Not Found - Kongunad Hospital',
      }
    }

    return {
      title: `${specialty.fields.name} - Kongunad Hospital`,
      description: specialty.fields.shortDescription || specialty.fields.description,
    }
  } catch (error) {
    return {
      title: 'Specialty - Kongunad Hospital',
      description: 'Hospital specialty information',
    }
  }
}

export async function generateStaticParams() {
  // This would need to fetch all specialties and generate params
  // For now, return empty array - Next.js will generate on demand
  return []
}

export const revalidate = 300

export default async function SpecialtyPage({ params }: SpecialtyPageProps) {
  try {
    const { type, slug } = await params
    const contentType = type === 'medical-specialties' ? 'medical' : 
                       type === 'surgical-specialties' ? 'surgical' : null
    
    if (!contentType) {
      notFound()
    }

    const specialty = await getSpecialtyByTypeAndSlugCached(contentType, slug) as unknown as Specialty | null

    if (!specialty) {
      notFound()
    }

    const typeName = TYPE_NAMES[type] || type

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/specialities-super-specialities" color="inherit">Specialities & Super Specialities</Link>
            <Link href={`/specialities-super-specialities/${type}`} color="inherit">{typeName}</Link>
            <Typography color="text.primary">{specialty.fields.name}</Typography>
          </Breadcrumbs>

          <Grid container spacing={4}>
            {/* Specialty Icon/Image */}
            {specialty.fields.icon && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      component="img"
                      src={`https:${specialty.fields.icon.fields.file.url}`}
                      alt={specialty.fields.name}
                      sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: 2,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Specialty Details */}
            <Grid item xs={12} md={specialty.fields.icon ? 8 : 12}>
              <Typography variant="h1" gutterBottom color="primary">
                {specialty.fields.name}
              </Typography>
              
              <Chip 
                label={typeName}
                color="primary" 
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {specialty.fields.shortDescription && (
                <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                  {specialty.fields.shortDescription}
                </Typography>
              )}

              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: 'text.secondary' }}>
                {specialty.fields.description}
              </Typography>

              {/* Services Offered */}
              {specialty.fields.services && specialty.fields.services.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    Services Offered
                  </Typography>
                  <List>
                    {specialty.fields.services.map((service, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemText 
                          primary={service}
                          primaryTypographyProps={{
                            variant: 'body1',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  } catch (error) {
    notFound()
  }
}

