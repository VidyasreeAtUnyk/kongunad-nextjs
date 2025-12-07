import { Box, Typography } from '@mui/material'
import React, { useMemo, useCallback } from 'react'
import { maxWidth } from '@/lib/constants'
import { OfferErrorBoundary } from './OfferErrorBoundary'

interface OfferItemType {
    title: string
    flash?: string
}

interface OfferProps {
    lists: OfferItemType[]
}

// Memoized Offer Item Component
const OfferItem: React.FC<{ item: OfferItemType; index: number; isLast: boolean }> = React.memo(({ item, index, isLast }) => {
    if (!item || !item.title) {
        console.warn('Invalid offer item:', item)
        return null
    }

    return (
        <Typography
            variant="body1"
            sx={{
                fontWeight: 600,
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
                    variant="body1"
                    sx={{
                        color: 'info.main',
                        fontWeight: 900,
                        ml: 0.5,
                        animation: 'flash 1s linear infinite',
                    }}
                >
                    {item.flash}
                </Typography>
            )}
        </Typography>
    )
}, (prevProps, nextProps) => {
    return prevProps.item.title === nextProps.item.title &&
           prevProps.item.flash === nextProps.item.flash &&
           prevProps.index === nextProps.index &&
           prevProps.isLast === nextProps.isLast
})

OfferItem.displayName = 'OfferItem'

export const Offer: React.FC<OfferProps> = ({ lists }) => {
    // Validate and filter lists
    const validLists = useMemo(() => {
        if (!Array.isArray(lists)) {
            console.warn('Offer lists is not an array:', lists)
            return []
        }
        return lists.filter((item): item is OfferItemType => {
            if (!item || typeof item !== 'object') return false
            if (!item.title || typeof item.title !== 'string') return false
            return true
        })
    }, [lists])

    // Don't render if no valid offers
    if (!validLists || validLists.length === 0) return null

    // Create marquee content with multiple sets for seamless looping - memoized
    const createMarqueeSets = useCallback(() => {
        const sets = []
        // Create 3 sets for smooth infinite scroll
        for (let setIndex = 0; setIndex < 3; setIndex++) {
            sets.push(
                <Box key={`set-${setIndex}`} sx={{ display: 'flex', gap: 2, alignItems: 'center', whiteSpace: 'nowrap' }}>
                    <Typography 
                        variant="body1"
                        sx={{
                            color: 'info.main',
                            fontWeight: 900,
                        }}
                    >
                        EXCLUSIVE OFFERS:
                    </Typography>
                    {validLists.map((item, index) => (
                        <OfferItem 
                            key={`${setIndex}-${index}`}
                            item={item} 
                            index={index} 
                            isLast={index === validLists.length - 1} 
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
    }, [validLists])

    const marqueeSets = useMemo(() => createMarqueeSets(), [createMarqueeSets])

    return (
        <OfferErrorBoundary>
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
                    <Typography 
                        variant="body1"
                        sx={{
                            color: 'info.main',
                            fontWeight: 900,
                        }}
                    >
                        EXCLUSIVE OFFERS:
                    </Typography>
                    {validLists.map((item, index) => (
                        <OfferItem 
                            key={`desktop-${index}-${item.title}`}
                            item={item} 
                            index={index} 
                            isLast={index === validLists.length - 1} 
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
                    <Box 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            animation: 'marquee 20s linear infinite',
                            willChange: 'transform',
                            '@keyframes marquee': {
                                '0%': {
                                    transform: 'translateX(0%)',
                                },
                                '100%': {
                                    transform: 'translateX(-33.333%)', // Move by 1/3 since we have 3 sets
                                },
                            },
                        }}
                    >
                        {marqueeSets}
                    </Box>
                </Box>
            </Box>
        </Box>
        </OfferErrorBoundary>
    )
}