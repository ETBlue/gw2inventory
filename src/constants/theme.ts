/**
 * Theme constants for consistent styling across the application
 * All color values should be defined here to maintain design consistency
 */

/**
 * Primary application colors
 */
export const COLORS = {
  /** Primary brand color (pink/magenta theme) */
  PRIMARY: "hsla(326, 73%, 55%, 1)",

  /** Primary color with transparency for hover effects */
  PRIMARY_HOVER: "hsla(326, 15%, 55%, 0.1)",

  /** Background color for main content areas */
  BACKGROUND: "hsla(50, 30%, 98%, 1)",

  /** Text colors */
  TEXT: {
    PRIMARY: "#333",
    SECONDARY: "#666",
    LIGHT: "#999",
  },

  /** GW2 rarity colors (from game) */
  GW2_RARITY: {
    BASIC: "#000000",
    FINE: "#62A4DA",
    MASTERWORK: "#1a9306",
    RARE: "#fcd00b",
    EXOTIC: "#ffa405",
    ASCENDED: "#fb3e8d",
    LEGENDARY: "#4C139D",
    JUNK: "#8C8C8C",
  },
} as const

/**
 * Border styles
 */
export const BORDERS = {
  /** Primary border style used throughout the app */
  PRIMARY: `2px ${COLORS.PRIMARY} solid`,

  /** Thin border for subtle separations */
  THIN: `1px ${COLORS.TEXT.LIGHT} solid`,
} as const

/**
 * Component-specific theme tokens
 */
export const COMPONENT_THEME = {
  HEADER: {
    BORDER_BOTTOM: BORDERS.PRIMARY,
    HOVER_BACKGROUND: COLORS.PRIMARY_HOVER,
    ACTIVE_BACKGROUND: COLORS.PRIMARY,
    ACTIVE_COLOR: "white",
  },

  CONTENT: {
    BACKGROUND: COLORS.BACKGROUND,
    PADDING: "1rem",
  },
} as const

/**
 * CSS custom properties for use in CSS files
 * These can be used in CSS as var(--color-primary)
 */
export const CSS_VARIABLES = {
  "--color-primary": COLORS.PRIMARY,
  "--color-primary-hover": COLORS.PRIMARY_HOVER,
  "--color-background": COLORS.BACKGROUND,
  "--color-text-primary": COLORS.TEXT.PRIMARY,
  "--color-text-secondary": COLORS.TEXT.SECONDARY,
  "--border-primary": BORDERS.PRIMARY,
} as const
