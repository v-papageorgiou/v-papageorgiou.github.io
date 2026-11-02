// Paper and ink palettes for both reading themes. Values live in globals.css.
export const colors = {
  textHeading: 'text-foreground',
  textAccent: 'text-accent',
  textLink: 'text-link',

  // Warm paper surfaces
  bgMain: 'bg-background paper-texture',
  bgCard: 'bg-paper-surface/60',
  bgNav: 'bg-background paper-texture',
  bgFooter: 'bg-background/65',
  bgProfileImage: 'bg-paper-inset',
  bgAbstract: 'bg-paper-inset/70',
  bgSocialIcon: 'bg-paper-surface/80',

  // Subtle, warm borders
  borderNav: 'border-paper-line',
  borderCard: 'border-paper-line',
  borderCardHover: 'hover:border-paper-line-strong',
  borderProfile: 'border-paper-surface',
  borderSocial: 'border-paper-line',
  borderSocialHover: 'hover:border-paper-line-strong',
  borderAbstract: 'border-paper-line-strong',

  textBody: 'text-ink-soft',
  textSecondary: 'text-ink-soft',
  textNavLink: 'text-ink-soft',
  textNavLinkHover: 'hover:text-link-hover',
  textLinkHover: 'hover:text-link-hover',
  textFooterPrimary: 'text-ink-soft',
  textFooterSecondary: 'text-ink-muted',
} as const;

export const effects = {
  cardShadow: 'shadow-[var(--shadow-card)]',
  profileShadow: 'shadow-[var(--shadow-profile)]',
} as const;

export const transitions = {
  default: 'transition-colors duration-200',
  colors: 'transition-colors duration-200',
} as const;

export const classes = {
  card: `${colors.bgCard} rounded-lg p-4 border ${colors.borderCard} ${colors.borderCardHover} ${transitions.default} ${effects.cardShadow}`,
  navLink: `${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors}`,
  socialIcon: `p-3 ${colors.bgSocialIcon} rounded-full border ${colors.borderSocial} ${colors.borderSocialHover} hover:bg-paper-hover ${transitions.default} group`,
  socialIconContent: `w-5 h-5 ${colors.textLink} group-hover:text-link-hover ${transitions.colors}`,
  link: `${colors.textLink} ${colors.textLinkHover} hover:underline ${transitions.colors}`,
  cvButton: `flex items-center space-x-2 px-4 py-2 ${colors.bgSocialIcon} rounded-lg border ${colors.borderSocial} ${colors.borderSocialHover} hover:bg-paper-hover ${transitions.default} ${colors.textLink} ${colors.textLinkHover}`,
} as const;
