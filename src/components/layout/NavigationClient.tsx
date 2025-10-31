'use client'

import React, { useState } from 'react'
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

export const NavigationClient: React.FC<NavigationClientProps> = ({ 
  navigationData, 
  currentPage 
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDropdownToggle = (itemId: string) => {
    setExpandedDropdown(expandedDropdown === itemId ? null : itemId)
  }

  const handleSubmenuToggle = (itemId: string) => {
    setExpandedSubmenu(expandedSubmenu === itemId ? null : itemId)
  }

  // Group navigation data by type and position
  const groupedNav = React.useMemo(() => {
    const groups: Record<string, Navigation[]> = {}
    navigationData.forEach(nav => {
      const key = `${nav.fields.type}-${nav.fields.position}`
      groups[key] = groups[key] || []
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {groupedNav['secondary-left']?.[0]?.fields.items.map((item, index) => (
              <Box key={index} sx={{ width: 40, height: 40 }}>
                {(item.icon as any)?.resolvedUrl && (
                  <img
                    src={(item.icon as any).resolvedUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </Box>
            ))}
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
                  {groupedNav['primary-left']?.[0]?.fields.items.map((item, index) => (
                    <Link
                      key={index}
                      href={normalizePath(item.linkTo)}
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
                  ))}
                </Box>

                {/* Primary Right */}
                <Box sx={{ display: 'flex', gap: 3.75 }}>
                  {groupedNav['primary-right']?.[0]?.fields.items.map((item, index) => (
                    <Link
                      key={index}
                      href={normalizePath(item.linkTo)}
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
                  ))}
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {groupedNav['secondary-left']?.[0]?.fields.items.map((item, index) => (
                    <Box key={index} sx={{ height: 50 }}>
                      {(item.icon as any)?.resolvedUrl && (
                        <img
                          src={(item.icon as any).resolvedUrl}
                          alt={item.title}
                          style={{ height: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </Box>
                  ))}
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
}

// Desktop Navigation Item Component
const NavigationItemComponent: React.FC<{
  item: NavigationItem
  currentPage?: string
  onDropdownToggle: (id: string) => void
  expandedDropdown: string | null
}> = ({ item, currentPage, onDropdownToggle, expandedDropdown }) => {
  const [isHovered, setIsHovered] = useState(false)
  const itemId = `${item.title}-${item.linkTo}`

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={normalizePath(item.linkTo)}
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
            left: 0,
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderRadius: 3,
            py: 2,
            px: 3,
            width: 'min(1200px, 70vw)',
            maxWidth: 'calc(100vw - 40px)',
            zIndex: 1000,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            transform: 'translateX(-70%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {item.dropdown.map((dropdownItem, index) => (
            <DesktopDropdownItem key={index} item={dropdownItem} />
          ))}
        </Box>
      )}
    </Box>
  )
}

// Desktop Dropdown Item Component - 4-column grid layout
const DesktopDropdownItem: React.FC<{ item: any }> = ({ item }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Link
        href={normalizePath(item.to)}
        sx={{
          color: 'text.primary',
          fontSize: 15,
          fontWeight: 700,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          mb: item.sec && item.sec.length > 0 ? 0.5 : 0,
          py: item.sec && item.sec.length > 0 ? 0.75 : 0.25,
          px: 1,
          borderRadius: 1.5,
          backgroundColor: item.sec && item.sec.length > 0 ? 'grey.50' : 'transparent',
          transition: 'all 0.2s ease',
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
            style={{ width: 18, height: 18, marginRight: 6 }}
          />
        )}
        {item.title}
      </Link>
      
      {/* Show all submenu items directly below the main item */}
          {item.sec && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, ml: 0.5 }}>
          {item.sec.map((subItem: any, index: number) => (
                <Link
              key={index}
                  href={normalizePath(subItem.to)}
              sx={{
                color: 'text.secondary',
                fontSize: 13,
                textDecoration: 'none',
                display: 'block',
                py: 0.25,
                px: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'grey.50',
                  px: 1.25,
                },
              }}
            >
              {subItem.title}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

// Mobile Navigation Item Component (LinkAndDropdown equivalent)
const MobileNavigationItem: React.FC<{
  item: NavigationItem
  currentPage?: string
  isLast: boolean
}> = ({ item, currentPage, isLast }) => {
  const [showSubmenu, setShowSubmenu] = useState(false)

  return (
    <>
      {/* LinkDropdown equivalent */}
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Link
            href={item.linkTo}
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
              onClick={() => setShowSubmenu(true)}
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
                onClick={() => setShowSubmenu(false)}
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
}

// Mobile Dropdown Item Component
const MobileDropdownItem: React.FC<{ item: any }> = ({ item }) => {
  const [showTertiary, setShowTertiary] = useState(false)

  return (
    <>
      <Box sx={{ position: 'relative', }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative', paddingRight: 4.5 }}>
          <Link
            href={item.to}
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
              onClick={() => setShowTertiary(!showTertiary)}
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
            {item.sec.map((secItem: any, index: number) => (
              <Link
                key={index}
                href={secItem.to}
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
            ))}
          </Box>
        )}
      </Box>
    </>
  )
}
