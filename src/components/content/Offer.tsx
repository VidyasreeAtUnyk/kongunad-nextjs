import { Box, Typography } from '@mui/material'
import React from 'react'
import { maxWidth } from '@/lib/constants'

interface OfferItemType {
    title: string
    flash?: string
}

interface OfferProps {
    lists: OfferItemType[]
}

export const Offer: React.FC<OfferProps> = ({ lists }) => {
    // Don't render if no offers
    if (!lists || lists.length === 0) return null

    // Create a reusable offer item component
    const OfferItem = ({ item, index, isLast }: { item: OfferItemType; index: number; isLast: boolean }) => (
        <Typography
            sx={{
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '19px',
                color: 'white',
                position: 'relative',
                ...(isLast ? {} : {
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        backgroundColor: 'info.main',
                        borderRadius: '50%',
                        right: -8,
                        top: '50%',
                        transform: 'translate(50%,-50%)',
                    },
                }),
            }}
        >
            {item.title}
            {item.flash && (
                <Typography
                    component='span'
                    sx={{
                        color: 'info.main',
                        fontSize: 16,
                        fontWeight: 900,
                        lineHeight: '19px',
                        ml: 0.5,
                        animation: 'flash 1s linear infinite',
                    }}
                >
                    {item.flash}
                </Typography>
            )}
        </Typography>
    )

    // Create marquee content with multiple sets for seamless looping
    const createMarqueeSets = () => {
        const sets = []
        // Create 3 sets for smooth infinite scroll
        for (let setIndex = 0; setIndex < 3; setIndex++) {
            sets.push(
                <Box key={`set-${setIndex}`} sx={{ display: 'flex', gap: 2, alignItems: 'center', whiteSpace: 'nowrap' }}>
                    <Typography sx={{
                        color: 'info.main',
                        fontSize: 16,
                        fontWeight: 900,
                        lineHeight: '19px',
                    }}>
                        EXCLUSIVE OFFERS:
                    </Typography>
                    {lists.map((item, index) => (
                        <OfferItem 
                            key={`${setIndex}-${index}`}
                            item={item} 
                            index={index} 
                            isLast={index === lists.length - 1} 
                        />
                    ))}
                </Box>
            )
            
            // Add spacer between sets (except after the last set)
            if (setIndex < 2) {
                sets.push(
                    <Box key={`spacer-${setIndex}`} sx={{ width: '120px', flexShrink: 0 }} />
                )
            }
        }
        return sets
    }

    return (
        <Box
            sx={{
                backgroundColor: 'info.light',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 3.25,
                px: 1,
            }}>
                {/* Desktop: Static display */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    [`@media (max-width: ${maxWidth('lg')})`]: {
                        display: 'none',
                    },
                }}>
                    <Typography sx={{
                        color: 'info.main',
                        fontSize: 16,
                        fontWeight: 900,
                        lineHeight: '19px',
                    }}>
                        EXCLUSIVE OFFERS:
                    </Typography>
                    {lists.map((item, index) => (
                        <OfferItem 
                            key={index}
                            item={item} 
                            index={index} 
                            isLast={index === lists.length - 1} 
                        />
                    ))}
                </Box>

                {/* Mobile: Smooth marquee */}
                <Box sx={{
                    display: 'none',
                    [`@media (max-width: ${maxWidth('lg')})`]: {
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        overflow: 'hidden',
                    },
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        animation: 'marquee 20s linear infinite',
                        '@keyframes marquee': {
                            '0%': {
                                transform: 'translateX(0%)',
                            },
                            '100%': {
                                transform: 'translateX(-33.333%)', // Move by 1/3 since we have 3 sets
                            },
                        },
                    }}>
                        {createMarqueeSets()}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}