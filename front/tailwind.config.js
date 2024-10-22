/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Merienda', 'serif'],
      body: ['Montserrat', 'sans-serif'],
      hero: ['Merienda', 'sans-serif'],
    },
    colors: {
      primary: '#4ade80',
      secondary: '#f87171',
      selected: '#60a5fa',
      beige: '#F2DEBA',
      bg: '#F5F5F5',
      body: '#64748B',
      bodylight: '#4b5563',
      bodydark: '#AEB7C0',
      bodydark1: '#DEE4EE',
      bodydark2: '#8A99AF',
      current: 'currentColor',
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#1C2434',
      'black-2': '#010101',
      stroke: '#E2E8F0',
      graydark: '#333A48',
      'gray-2': '#F7F9FC',
      'gray-3': '#FAFAFA',
      whiten: '#F1F5F9',
      whiter: '#F5F7FD',
      boxdark: '#24303F',
      'boxdark-2': '#1A222C',
      strokedark: '#2E3A47',
      'form-strokedark': '#3d4d60',
      'form-input': '#1d2a39',
      'meta-1': '#DC3545',
      'meta-2': '#EFF2F7',
      'meta-3': '#10B981',
      'meta-4': '#313D4A',
      'meta-5': '#259AE6',
      'meta-6': '#FFBA00',
      'meta-7': '#FF6766',
      'meta-8': '#F0950C',
      'meta-9': '#E5E7EB',
      success: '#219653',
      danger: '#D34053',
      warning: '#FFA70B',
      done: '#607d8b',
      slate: {
        50: '#f8fafc',
        100: '#dee2e6',
        200: '#cbd3da',
        300: '#a8b8d8',
        400: '#8392ab',
        500: '#67748e',
        600: '#627594',
        700: '#344767',
        800: '#3a416f',
        900: '#0f172a',
      },
      gray: {
        50: '#f8f9fa',
        100: '#ebeff4',
        200: '#e9ecef',
        300: '#d2d6da',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#6c757d',
        700: '#495057',
        800: '#252f40',
        900: '#141727',
      },
    },
    boxShadow: {
      'soft-xxs': '0 1px 5px 1px #ddd',
      'soft-xs':
        '0 3px 5px -1px rgba(0,0,0,.09),0 2px 3px -1px rgba(0,0,0,.07)',
      'soft-sm':
        '0 .25rem .375rem -.0625rem hsla(0,0%,8%,.12),0 .125rem .25rem -.0625rem hsla(0,0%,8%,.07)',
      'soft-md':
        '0 4px 7px -1px rgba(0,0,0,.11),0 2px 4px -1px rgba(0,0,0,.07)',
      'soft-lg': '0 2px 12px 0 rgba(0,0,0,.16)',
      'soft-xl': '0 20px 27px 0 rgba(0,0,0,0.05)',
      'soft-2xl': '0 .3125rem .625rem 0 rgba(0,0,0,.12)',
      'soft-3xl':
        '0 8px 26px -4px hsla(0,0%,8%,.15),0 8px 9px -5px hsla(0,0%,8%,.06)',
      'soft-primary-outline': '0 0 0 2px #e9aede',
      blur: 'inset 0 0 1px 1px hsla(0,0%,100%,.9),0 20px 27px 0 rgba(0,0,0,.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 23px 45px -11px hsla(0,0%,8%,.25)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      none: 'none',
    },
    extend: {},
  },
  plugins: [],
});
