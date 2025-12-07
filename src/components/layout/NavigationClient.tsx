'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { Navigation, NavigationItem } from '@/types/contentful'

// Simple Logo component - fixed dimensions prevent layout shift without skeleton
// Navigation logos are small and load quickly, skeleton causes more issues than it solves
const LogoWithSkeleton: React.FC<{
  src: string | null
  alt: string
  width: number
  height: number
  preserveAspectRatio?: boolean
}> = React.memo(({ src, alt, width, height, preserveAspectRatio = false }) => {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    // Reserve space even if no image
    return <Box sx={{ width, height, flexShrink: 0 }} aria-label={alt} />
  }

  return (
    <Box 
      sx={{ 
        width: preserveAspectRatio ? 'auto' : width, 
        height, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        minWidth: preserveAspectRatio ? width : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        onError={() => setImageError(true)}
        style={{
          width: preserveAspectRatio ? 'auto' : '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  )
}, (prevProps, nextProps) => {
  return prevProps.src === nextProps.src &&
         prevProps.alt === nextProps.alt &&
         prevProps.width === nextProps.width &&
         prevProps.height === nextProps.height &&
         prevProps.preserveAspectRatio === nextProps.preserveAspectRatio
})

LogoWithSkeleton.displayName = 'LogoWithSkeleton'

const normalizePath = (href?: string | null): string | undefined => {
  if (!href) return href as any
  try {
    if (href.startsWith('/facilities/')) {
      const m = href.match(/^\/facilities\/[^\/]+\/([^\/]+)(?:\/?|$)/)
      if (m && m[1]) {
        return `/facilities/${m[1]}`
      }
    }
    return href
  } catch {
    return href
  }
}

interface NavigationClientProps {
  navigationData: Navigation[]
  currentPage?: string
}

export const NavigationClient: React.FC<NavigationClientProps> = React.memo(({ 
  navigationData, 
  currentPage 
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)

  const handleMobileToggle = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const handleDropdownToggle = useCallback((itemId: string) => {
    setExpandedDropdown(prev => prev === itemId ? null : itemId)
  }, [])

  const handleSubmenuToggle = useCallback((itemId: string) => {
    setExpandedSubmenu(prev => prev === itemId ? null : itemId)
  }, [])

  // Group navigation data by type and position - memoized for performance
  const groupedNav = useMemo(() => {
    if (!Array.isArray(navigationData) || navigationData.length === 0) {
      return {}
    }

    const groups: Record<string, Navigation[]> = {}
    navigationData.forEach(nav => {
      if (!nav?.fields?.type || !nav?.fields?.position) {
        console.warn('Invalid navigation item missing type or position:', nav)
        return
      }
      const key = `${nav.fields.type}-${nav.fields.position}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(nav)
    })
    return groups
  }, [navigationData])

  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile Navigation */}
      {isMobile && (
        <Box
          sx={{
            height: 59,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          {/* Mobile Logos */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {groupedNav['secondary-left']?.[0]?.fields.items.map((item, index) => {
              const icon = item.icon as any
              const iconUrl = icon?.resolvedUrl || null
              return (
                <LogoWithSkeleton
                  key={index}
                  src={iconUrl}
                  alt={item.title || 'Logo'}
                  width={40}
                  height={40}
                />
              )
            })}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton onClick={handleMobileToggle} sx={{ color: 'primary.main' }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <>
          {/* Primary Navigation */}
          <Box
            sx={{
              height: 41,
              backgroundColor: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Primary Left */}
                <Box sx={{ display: 'flex', gap: 3.75 }}>
                  {groupedNav['primary-left']?.[0]?.fields.items.map((item, index) => {
                    const href = normalizePath(item.linkTo)
                    const isExternal = isExternalUrl(href)
                    return (
                      <Link
                        key={index}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        sx={{
                          color: 'white',
                          fontSize: 12,
                          lineHeight: '16px',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                          ...(currentPage === item.linkTo && {
                            textDecoration: 'underline',
                          }),
                        }}
                      >
                        {item.title}
                      </Link>
                    )
                  })}
                </Box>

                {/* Primary Right */}
                <Box sx={{ display: 'flex', gap: 3.75 }}>
                  {groupedNav['primary-right']?.[0]?.fields.items.map((item, index) => {
                    const href = normalizePath(item.linkTo)
                    const isExternal = isExternalUrl(href)
                    return (
                      <Link
                        key={index}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        sx={{
                          color: 'white',
                          fontSize: 12,
                          lineHeight: '16px',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                          ...(currentPage === item.linkTo && {
                            textDecoration: 'underline',
                          }),
                        }}
                      >
                        {item.title}
                      </Link>
                    )
                  })}
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Secondary Navigation */}
          <Box
            sx={{
              height: 79,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Secondary Left - Logos */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {groupedNav['secondary-left']?.[0]?.fields.items.map((item, index) => {
                    const icon = item.icon as any
                    const iconUrl = icon?.resolvedUrl || null
                    return (
                      <LogoWithSkeleton
                        key={index}
                        src={iconUrl}
                        alt={item.title || 'Logo'}
                        width={50}
                        height={50}
                        preserveAspectRatio
                      />
                    )
                  })}
                </Box>

                {/* Secondary Right - Main Navigation */}
                <Box sx={{ display: 'flex', gap: 5, pl: 2.5 }}>
                  {groupedNav['secondary-right']?.[0]?.fields.items.map((item, index) => (
                    <NavigationItemComponent
                      key={index}
                      item={item}
                      currentPage={currentPage}
                      onDropdownToggle={handleDropdownToggle}
                      expandedDropdown={expandedDropdown}
                    />
                  ))}
                </Box>
              </Box>
            </Container>
          </Box>
        </>
      )}

      {/* Mobile Drawer - Always Rendered */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 300,
          backgroundColor: 'white',
          boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          zIndex: 1300,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in',
          p: 2.5,
          boxSizing: 'border-box',
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" sx={{ 
            color: 'primary.main', 
            fontWeight: 500,
            width: '50%',
            lineHeight: '20px'
          }}>
            KONGUNAD HOSPITALS
          </Typography>
          <IconButton onClick={handleMobileToggle} sx={{ color: 'primary.main' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile Navigation Items */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 5, 
          pt: 2.5,
          position: 'relative',
          overflow: 'hidden',
          overflowY: 'scroll'
        }}>
          {groupedNav['mobile-mobile']?.[0]?.fields.items.map((item, index) => (
            <MobileNavigationItem
              key={index}
              item={item}
              currentPage={currentPage}
              isLast={index === (groupedNav['mobile-mobile']?.[0]?.fields.items.length || 0) - 1}
            />
          ))}
        </Box>
      </Box>

      {/* Backdrop - Always Rendered */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1299,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-in',
        }}
        onClick={handleMobileToggle}
      />
    </Box>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  if (prevProps.currentPage !== nextProps.currentPage) return false
  if (prevProps.navigationData.length !== nextProps.navigationData.length) return false
  
  // Deep comparison of navigation data structure
  return prevProps.navigationData.every((nav, index) => {
    const nextNav = nextProps.navigationData[index]
    if (!nextNav) return false
    return nav.sys.id === nextNav.sys.id &&
           nav.fields.type === nextNav.fields.type &&
           nav.fields.position === nextNav.fields.position
  })
})

NavigationClient.displayName = 'NavigationClient'

// Desktop Navigation Item Component
const NavigationItemComponent: React.FC<{
  item: NavigationItem
  currentPage?: string
  onDropdownToggle: (id: string) => void
  expandedDropdown: string | null
}> = React.memo(({ item, currentPage, onDropdownToggle, expandedDropdown }) => {
  const [isHovered, setIsHovered] = useState(false)
  const itemId = useMemo(() => `${item.title}-${item.linkTo}`, [item.title, item.linkTo])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  if (!item || !item.title) {
    console.warn('Invalid navigation item:', item)
    return null
  }

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={normalizePath(item.linkTo)}
        target={isExternalUrl(item.linkTo) ? '_blank' : undefined}
        rel={isExternalUrl(item.linkTo) ? 'noopener noreferrer' : undefined}
        sx={{
          color: 'text.primary',
          fontSize: 18,
          fontWeight: 500,
          lineHeight: '25px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            color: 'primary.main',
          },
          ...(currentPage === item.linkTo && {
            color: 'primary.main',
          }),
        }}
      >
        {item.title}
        {item.hasDropdown && (
          <ExpandMoreIcon
            sx={{
              ml: 0.5,
              fontSize: 16,
              transition: 'transform 0.2s ease-in',
              transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
              ...(currentPage === item.linkTo && {
                color: 'primary.main',
              }),
            }}
          />
        )}
      </Link>

      {/* Desktop Dropdown */}
      {item.hasDropdown && item.dropdown && isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderRadius: 3,
            py: 2,
            px: 3,
            width: item.title === 'Specialities' 
              ? 'min(800px, 60vw)' 
              : 'min(1200px, 70vw)',
            maxWidth: 'calc(100vw - 40px)',
            zIndex: 1000,
            display: 'grid',
            // Special layout for Specialities (2 items) vs Facilities (8 items)
            gridTemplateColumns: item.title === 'Specialities' 
              ? 'repeat(2, 1fr)' 
              : 'repeat(4, 1fr)',
            gap: item.title === 'Specialities' ? 4 : 2,
            // For Specialities (near right edge), align to right edge of trigger
            // For Facilities (more centered), use translateX
            ...(item.title === 'Specialities' 
              ? {
                  right: 0,
                  left: 'auto',
                  transform: 'none',
                }
              : {
                  left: 0,
                  right: 'auto',
                  transform: 'translateX(-70%)',
                }
            ),
            // Ensure grid items don't overflow
            gridAutoRows: 'min-content',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {item.dropdown.map((dropdownItem, index) => (
            <DesktopDropdownItem 
              key={index} 
              item={dropdownItem} 
              isSpecialities={item.title === 'Specialities'}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.title === nextProps.item.title &&
         prevProps.item.linkTo === nextProps.item.linkTo &&
         prevProps.currentPage === nextProps.currentPage &&
         prevProps.expandedDropdown === nextProps.expandedDropdown
})

NavigationItemComponent.displayName = 'NavigationItemComponent'

// Helper to check if URL is external
const isExternalUrl = (url?: string | null): boolean => {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

// Desktop Dropdown Item Component - 4-column grid layout
const DesktopDropdownItem: React.FC<{ item: any; isSpecialities?: boolean }> = React.memo(({ item, isSpecialities = false }) => {
  const href = useMemo(() => normalizePath(item.to), [item.to])
  const isExternal = useMemo(() => isExternalUrl(href), [href])

  if (!item || !item.title) {
    console.warn('Invalid dropdown item:', item)
    return null
  }

  // For Specialities, organize sub-items in columns if there are many
  const shouldUseColumns = isSpecialities && item.sec && item.sec.length > 10
  const columnCount = shouldUseColumns ? 2 : 1

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minWidth: 0, 
      maxWidth: '100%',
      overflow: 'hidden',
      wordBreak: 'break-word',
    }}>
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        sx={{
          color: 'text.primary',
          fontSize: 15,
          fontWeight: 700,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'flex-start',
          mb: item.sec && item.sec.length > 0 ? 0.5 : 0,
          py: item.sec && item.sec.length > 0 ? 0.75 : 0.25,
          px: 1,
          borderRadius: 1.5,
          backgroundColor: item.sec && item.sec.length > 0 ? 'grey.50' : 'transparent',
          transition: 'all 0.2s ease',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: item.sec && item.sec.length > 0 ? 'grey.100' : 'grey.50',
          },
        }}
      >
        {(item.icon as any)?.resolvedUrl && (
          <img
            src={(item.icon as any).resolvedUrl}
            alt={item.iconAlt}
            style={{ width: 18, height: 18, marginRight: 6, flexShrink: 0, marginTop: 2 }}
          />
        )}
        <Box component="span" sx={{ lineHeight: 1.4, minWidth: 0 }}>
          {item.title}
        </Box>
      </Link>
      
      {/* Show all submenu items directly below the main item */}
      {item.sec && (
        <Box 
          sx={{ 
            display: shouldUseColumns ? 'grid' : 'flex',
            gridTemplateColumns: shouldUseColumns ? 'repeat(2, 1fr)' : 'none',
            flexDirection: shouldUseColumns ? 'row' : 'column',
            gap: 0.25,
            ml: 0.5,
            columnGap: shouldUseColumns ? 2 : 0,
          }}
        >
          {item.sec.map((subItem: any, index: number) => {
            const subHref = normalizePath(subItem.to)
            const subIsExternal = isExternalUrl(subHref)
            return (
              <Link
                key={index}
                href={subHref}
                target={subIsExternal ? '_blank' : undefined}
                rel={subIsExternal ? 'noopener noreferrer' : undefined}
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  textDecoration: 'none',
                  display: 'block',
                  py: 0.25,
                  px: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  lineHeight: 1.4,
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'grey.50',
                    px: 1.25,
                  },
                }}
              >
                {subItem.title}
              </Link>
            )
          })}
        </Box>
      )}
    </Box>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.title === nextProps.item.title &&
         prevProps.item.to === nextProps.item.to &&
         prevProps.isSpecialities === nextProps.isSpecialities
})

DesktopDropdownItem.displayName = 'DesktopDropdownItem'

// Mobile Navigation Item Component (LinkAndDropdown equivalent)
const MobileNavigationItem: React.FC<{
  item: NavigationItem
  currentPage?: string
  isLast: boolean
}> = React.memo(({ item, currentPage, isLast }) => {
  const [showSubmenu, setShowSubmenu] = useState(false)

  const handleShowSubmenu = useCallback(() => setShowSubmenu(true), [])
  const handleHideSubmenu = useCallback(() => setShowSubmenu(false), [])

  if (!item || !item.title) {
    console.warn('Invalid mobile navigation item:', item)
    return null
  }

  return (
    <>
      {/* LinkDropdown equivalent */}
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Link
            href={item.linkTo}
            target={isExternalUrl(item.linkTo) ? '_blank' : undefined}
            rel={isExternalUrl(item.linkTo) ? 'noopener noreferrer' : undefined}
            sx={{
              color: 'primary.main',
              fontSize: 18,
              fontWeight: 500,
              lineHeight: '25px',
              textDecoration: 'none',
              position: 'relative',
              cursor: 'pointer',
              width: '100%',
              display: 'block',
              '&:hover': {
                color: 'secondary.main',
              },
              ...(currentPage === item.linkTo && {
                color: 'primary.main',
              }),
              ...(!isLast && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 'calc(100% + 20px)',
                  width: 'calc(100% + 40px)',
                  height: '1px',
                  backgroundColor: 'divider',
                  left: 0,
                }
              })
            }}
          >
            {item.title}
          </Link>

          {item.hasDropdown && (
            <IconButton
              onClick={handleShowSubmenu}
              aria-label={`Open ${item.title} submenu`}
              sx={{
                backgroundColor: 'divider',
                color: 'primary.main',
                p: 1.25,
                position: 'absolute',
                left: '100%',
                top: '50%',
                transform: 'translate(-100%, -50%)',
                '&:hover': {
                  backgroundColor: 'divider',
                },
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: 16,
                  transform: 'rotate(-90deg)',
                  filter: 'brightness(0) saturate(100%) invert(31%) sepia(95%) saturate(2256%) hue-rotate(214deg) brightness(88%) contrast(95%)',
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>


        {/* SecondaryMenu equivalent */}
        {item.hasDropdown && item.dropdown && (
          <Box
            sx={{
              position: 'absolute',
              backgroundColor: 'white',
              top: 0,
              width: '100%',
              zIndex: 1000,
              padding: '20px 20px 20px 0',
              boxSizing: 'border-box',
              gap: 2.5,
              display: 'flex',
              flexDirection: 'column',
              left: showSubmenu ? 0 : 'calc(100% + 0px)',
              transition: 'all 0.3s ease-in',
            }}
          >
            {/* Back Button */}
            <Box sx={{ mb: 1 }}>
              <IconButton
                onClick={handleHideSubmenu}
                aria-label="Back to main menu"
                sx={{
                  color: 'primary.main',
                  p: 0,
                  textAlign: 'left',
                  border: 0,
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  height: '20px',
                  width: 'fit-content',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} />
                <Typography sx={{ color: 'primary.main', fontSize: 16 }}>
                  Back
                </Typography>
              </IconButton>
            </Box>

            {/* Submenu Items */}
            {item.dropdown.map((dropdownItem, index) => (
              <MobileDropdownItem key={index} item={dropdownItem} />
            ))}
          </Box>
        )}
    </>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.title === nextProps.item.title &&
         prevProps.item.linkTo === nextProps.item.linkTo &&
         prevProps.currentPage === nextProps.currentPage &&
         prevProps.isLast === nextProps.isLast
})

MobileNavigationItem.displayName = 'MobileNavigationItem'

// Mobile Dropdown Item Component
const MobileDropdownItem: React.FC<{ item: any }> = React.memo(({ item }) => {
  const [showTertiary, setShowTertiary] = useState(false)

  const handleToggleTertiary = useCallback(() => {
    setShowTertiary(prev => !prev)
  }, [])

  if (!item || !item.title) {
    console.warn('Invalid mobile dropdown item:', item)
    return null
  }

  return (
    <>
      <Box sx={{ position: 'relative', }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative', paddingRight: 4.5 }}>
          <Link
            href={item.to}
            target={isExternalUrl(item.to) ? '_blank' : undefined}
            rel={isExternalUrl(item.to) ? 'noopener noreferrer' : undefined}
            sx={{
              color: 'primary.main',
              fontSize: 18,
              fontWeight: 500,
              lineHeight: '25px',
              textDecoration: 'none',
              flex: 1,
              position: 'relative',
              cursor: 'pointer',
              width: '100%',
              display: 'block',
              '&:hover': {
                color: 'secondary.main',
              },
            }}
          >
            {item.title}
          </Link>

          {item.sec && (
            <IconButton
              onClick={handleToggleTertiary}
              aria-label={`Toggle ${item.title} submenu`}
              aria-expanded={showTertiary}
              sx={{
                backgroundColor: 'divider',
                color: 'primary.main',
                p: 1.25,
                position: 'absolute',
                left: '100%',
                top: '50%',
                transform: 'translate(-100%, -50%)',
                '&:hover': {
                  backgroundColor: 'divider',
                },
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: 16,
                  transform: showTertiary ? 'rotate(-180deg)' : 'rotate(0deg)',
                  filter: 'brightness(0) saturate(100%) invert(31%) sepia(95%) saturate(2256%) hue-rotate(214deg) brightness(88%) contrast(95%)',
                  transition: 'all 0.2s ease-in',
                }}
              />
            </IconButton>
          )}
        </Box>

        {/* Tertiary Menu */}
        {item.sec && (
          <Box
            sx={{
              width: '100%',
              flexDirection: 'column',
              gap: 1.25,
              padding: '10px',
              display: showTertiary ? 'flex' : 'none',
              height: showTertiary ? 'auto' : 0,
              transition: 'all 0.3s ease-in',
            }}
          >
            {item.sec.map((secItem: any, index: number) => {
              const secHref = normalizePath(secItem.to)
              const secIsExternal = isExternalUrl(secHref)
              return (
                <Link
                  key={index}
                  href={secHref}
                  target={secIsExternal ? '_blank' : undefined}
                  rel={secIsExternal ? 'noopener noreferrer' : undefined}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: 16,
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  {secItem.title}
                </Link>
              )
            })}
          </Box>
        )}
      </Box>
    </>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.title === nextProps.item.title &&
         prevProps.item.to === nextProps.item.to
})

MobileDropdownItem.displayName = 'MobileDropdownItem'
