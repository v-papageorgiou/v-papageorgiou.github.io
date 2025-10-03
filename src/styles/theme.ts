// Centralized theme configuration for the website
export const colors = {
  // Primary theme colors
  orange: 'text-orange-300',
  cyan: 'text-cyan-400',
  cyanLight: 'text-cyan-300', 
  cyanDark: 'text-cyan-200',
  
  // Background colors
  bgMain: 'bg-black bg-gradient-to-br from-gray-950 via-cyan-950 to-black',
  bgCard: 'bg-gray-900/60 backdrop-blur-md',
  bgNav: 'bg-black/80 backdrop-blur-sm',
  bgProfileImage: 'bg-cyan-950',
  bgAbstract: 'bg-cyan-950/40 backdrop-blur-sm',
  bgSocialIcon: 'bg-gray-900/80',
  
  // Border colors
  borderNav: 'border-cyan-400/30',
  borderCard: 'border-cyan-400/50',
  borderCardHover: 'hover:border-cyan-300',
  borderProfile: 'border-cyan-400',
  borderSocial: 'border-cyan-400',
  borderSocialHover: 'hover:border-cyan-300',
  borderAbstract: 'border-cyan-400',
  
  // Text colors
  textBody: 'text-gray-100',
  textSecondary: 'text-gray-200',
  textNavLink: 'text-gray-300',
  textNavLinkHover: 'hover:text-cyan-400',
  textLinkHover: 'hover:text-cyan-300',
  textFooterPrimary: 'text-gray-300',
  textFooterSecondary: 'text-gray-400',
} as const;

export const effects = {
  dropShadow: 'drop-shadow-lg',
  glowCyan: 'hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
  glowCyanStrong: 'hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
  glowCyanCard: 'hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]',
  shadowCyan: 'shadow-cyan-400/50',
  shadowCyanHover: 'hover:shadow-cyan-400/50',
  shadowCyanCard: 'hover:shadow-cyan-400/30',
  shadowLg: 'shadow-md',
  profileGlow: 'drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]',
  iconGlow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
} as const;

export const transitions = {
  default: 'transition-all duration-300',
  colors: 'transition-colors duration-300',
} as const;

// Common class combinations
export const classes = {
  // Card styling
  card: `${colors.bgCard} rounded-lg p-4 border ${colors.borderCard} ${colors.borderCardHover} ${transitions.default} ${effects.shadowCyanCard} ${effects.glowCyanCard}`,
  
  // Navigation link styling  
  navLink: `${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors} ${effects.glowCyan}`,
  
  // Social icon styling
  socialIcon: `p-3 ${colors.bgSocialIcon} rounded-full border ${colors.borderSocial} ${colors.borderSocialHover} hover:bg-cyan-950/60 ${transitions.default} group ${effects.shadowCyanHover} ${effects.glowCyanStrong}`,
  
  // Social icon content styling
  socialIconContent: `w-5 h-5 ${colors.cyan} group-hover:text-cyan-300 ${transitions.colors}`,
  
  // Regular link styling
  link: `${colors.cyan} ${colors.textLinkHover} hover:underline ${transitions.colors} ${effects.glowCyan}`,
  
  // CV button styling
  cvButton: `flex items-center space-x-2 px-4 py-2 ${colors.bgSocialIcon} rounded-lg border ${colors.borderSocial} ${colors.borderSocialHover} hover:bg-cyan-950/60 ${transitions.default} ${effects.shadowCyanHover} ${effects.glowCyanStrong} ${colors.cyan} ${colors.textLinkHover}`,
} as const;
