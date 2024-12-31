import { themeConfig } from './src/theme/theme.config';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './mockup/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: themeConfig.colors,
      spacing: themeConfig.spacing,
      fontFamily: themeConfig.typography.fontFamily,
      fontSize: themeConfig.typography.fontSize,
      fontWeight: themeConfig.typography.fontWeight,
      lineHeight: themeConfig.typography.lineHeight,
      screens: themeConfig.breakpoints,
      boxShadow: themeConfig.shadows,
      transitionDuration: themeConfig.animation.duration,
      transitionTimingFunction: themeConfig.animation.timing,
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  darkMode: 'class',
};

export default config;
