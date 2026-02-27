/**
 * Theme configuration for game-highlight template
 * Minimal — game highlights use the video footage as the visual, not slides.
 */

import type { Theme } from '../../../../lib/theme';

export const defaultTheme: Theme = {
  colors: {
    primary: '#0066FF',
    primaryLight: '#3388FF',
    accent: '#00D4AA',
    textDark: '#ffffff',
    textMedium: '#888888',
    textLight: '#555555',
    bgLight: '#0a0a0a',
    bgDark: '#000000',
    bgOverlay: 'rgba(255, 255, 255, 0.05)',
    divider: '#222222',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    primary: 'Microsoft JhengHei, Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 48, xl: 80, xxl: 120 },
  borderRadius: { sm: 6, md: 12, lg: 20 },
  typography: {
    h1: { size: 72, weight: 700 },
    h2: { size: 56, weight: 600 },
    h3: { size: 40, weight: 600 },
    body: { size: 24, weight: 400 },
    label: { size: 16, weight: 500, letterSpacing: 1 },
  },
};
