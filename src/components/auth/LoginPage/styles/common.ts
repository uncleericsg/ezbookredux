/**
 * Common styles used across login components
 */
export const COMMON_STYLES = {
  containers: {
    root: 'min-h-screen w-full relative',
    panel: 'bg-gray-800/50 border-gray-700/70 rounded-xl backdrop-blur-sm',
    content: 'relative z-10 flex flex-col items-center justify-start w-full pt-6 px-4 sm:px-6 lg:px-8',
    grid: 'grid grid-cols-1 md:grid-cols-5 gap-6 divide-gray-700',
    form: 'w-full space-y-4'
  },

  panels: {
    firstTime: 'md:col-span-3 flex flex-col items-center justify-center p-6',
    existing: 'md:col-span-2 flex flex-col items-center justify-center p-6'
  },

  buttons: {
    base: 'w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-all duration-200',
    primary: 'text-gray-900 bg-[#FFD700] hover:bg-yellow-500 focus:ring-[#FFD700]',
    secondary: 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500',
    accent: 'text-white bg-gradient-to-r from-[#FFD700] to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500',
    icon: 'ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1'
  },

  inputs: {
    container: 'mt-1 block w-full',
    base: 'px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#FFD700] focus:border-[#FFD700] sm:text-sm',
    label: 'block text-sm font-medium text-gray-300'
  },

  text: {
    title: 'text-xl font-bold text-[#FFD700]',
    subtitle: 'text-gray-300 text-center text-sm',
    error: 'text-red-500 text-sm',
    link: 'text-[#FFD700] hover:text-yellow-500'
  },

  backgrounds: {
    video: 'absolute inset-0 w-full h-full object-cover',
    gradient: 'absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#030812]/90',
    loading: 'absolute inset-0 bg-gray-900 animate-pulse'
  },

  animations: {
    fadeIn: 'transition-opacity duration-500',
    buttonHover: 'transition-transform duration-200',
    groupHover: 'group-hover:translate-x-1'
  },

  effects: {
    shadow: 'shadow-lg',
    glow: {
      yellow: 'shadow-yellow-500/20',
      blue: 'shadow-blue-500/20',
      green: 'shadow-green-500/20'
    },
    border: {
      yellow: 'border border-yellow-600/30',
      blue: 'border border-blue-600/30',
      green: 'border border-green-500/30'
    }
  },

  responsive: {
    container: 'max-w-6xl w-full',
    image: 'mx-auto h-16 w-auto'
  },

  utils: {
    center: 'flex items-center justify-center',
    spaceBetween: 'flex items-center justify-between',
    spaceY: 'space-y-3',
    spaceX: 'space-x-4'
  }
} as const;

/**
 * Helper function to combine multiple tailwind classes
 */
export const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

type StyleKey = keyof typeof COMMON_STYLES;
type NestedStyleKey<T> = T extends object ? keyof T : never;

/**
 * Helper function to get styles from common styles object
 * @param category The top level category in COMMON_STYLES
 * @param key The nested key within the category
 * @returns The style string or undefined
 */
export const getStyle = <T extends StyleKey>(
  category: T,
  key?: NestedStyleKey<typeof COMMON_STYLES[T]>
): string => {
  const styles = COMMON_STYLES[category];
  if (key && typeof styles === 'object') {
    return (styles as any)[key] || '';
  }
  return typeof styles === 'string' ? styles : '';
};

/**
 * Helper function to combine custom styles with common styles
 */
export const withStyles = (customStyles?: string, ...commonStyles: string[]) => {
  return cn(customStyles, ...commonStyles);
};