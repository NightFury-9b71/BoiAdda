// Color Palette for BoiAdda
export const colors = {
  // Primary Colors (Green Theme)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Secondary Colors (Blue for accents)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Status Colors
  status: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },

  // Semantic Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    success: '#f0fdf4',
    warning: '#fffbeb',
    error: '#fef2f2',
    info: '#eff6ff',
  },

  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6b7280',
    accent: '#16a34a',
    white: '#ffffff',
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c',
    info: '#1d4ed8',
  },

  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    accent: '#22c55e',
    success: '#bbf7d0',
    warning: '#fef3c7',
    error: '#fee2e2',
    info: '#dbeafe',
  },
};

// Tailwind CSS class mappings for easy use
export const colorClasses = {
  // Background classes
  bg: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    accent: 'bg-green-600',
    accentHover: 'hover:bg-green-700',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    gradient: 'bg-gradient-to-r from-green-600 to-green-700',
  },

  // Text classes
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    accent: 'text-green-600',
    accentHover: 'hover:text-green-700',
    white: 'text-white',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  },

  // Border classes
  border: {
    primary: 'border-gray-300',
    secondary: 'border-gray-200',
    accent: 'border-green-500',
    success: 'border-green-300',
    warning: 'border-yellow-300',
    error: 'border-red-300',
    info: 'border-blue-300',
  },

  // Ring/Focus classes
  ring: {
    accent: 'focus:ring-green-500',
    success: 'focus:ring-green-500',
    warning: 'focus:ring-yellow-500',
    error: 'focus:ring-red-500',
    info: 'focus:ring-blue-500',
  },
};

export default colors;
