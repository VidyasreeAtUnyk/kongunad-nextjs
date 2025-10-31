/**
 * Application constants
 * Centralized values for consistency across the app
 */

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

/**
 * Media query helper strings for use in sx props
 * Usage: `@media (max-width: ${BREAKPOINTS_MEDIA.md})`
 */
export const BREAKPOINTS_MEDIA = {
  xs: `${BREAKPOINTS.xs}px`,
  sm: `${BREAKPOINTS.sm}px`,
  md: `${BREAKPOINTS.md}px`,
  lg: `${BREAKPOINTS.lg}px`,
  xl: `${BREAKPOINTS.xl}px`,
} as const

/**
 * Helper for max-width media queries
 * @example maxWidth('md') returns '899px' (md - 1)
 */
export const maxWidth = (breakpoint: keyof typeof BREAKPOINTS): string => {
  const value = BREAKPOINTS[breakpoint]
  return `${value - 1}px`
}

