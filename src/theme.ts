// Design-system colors for places where CSS variables can't be used (SVG attributes).
// Values copied from design-system/tokens.css; keep them in sync.

import type { Status } from './data/types'

export const DS = {
  gray100: '#060c13',
  gray90: '#0d141e',
  gray60: '#323e4e',
  gray50: '#4b596b',
  gray30: '#8e99a9',
  gray0: '#f2f5f9',
  red: '#df746a',
  orange: '#ee9b58',
  green: '#79c68a',
  blue: '#67b5e1',
} as const

/** Status colors for text and icons (HTML): CSS variables from the design system. */
export const STATUS_COLOR: Record<Status, string> = {
  green: 'var(--green-default)',
  yellow: 'var(--orange-default)',
  red: 'var(--red-default)',
}
