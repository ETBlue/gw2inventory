/**
 * UI-related constants for consistent user interface behavior
 */

/**
 * Pagination component configuration
 */
export const PAGINATION = {
  /** Number of page buttons to show on each side of current page */
  VISIBLE_PAGE_RANGE: 10,
} as const

/**
 * Layout and spacing constants
 */
export const LAYOUT = {
  /** Standard padding for main content areas */
  CONTENT_PADDING: "1rem",
  
  /** Height for header/navigation elements */
  HEADER_HEIGHT: "100%",
  
  /** Border width for UI elements */
  BORDER_WIDTH: "2px",
} as const

/**
 * Animation and timing constants
 */
export const ANIMATION = {
  /** Duration for CSS transitions */
  TRANSITION_DURATION: "0.25s",
  
  /** Easing function for transitions */
  TRANSITION_EASING: "ease-out",
} as const