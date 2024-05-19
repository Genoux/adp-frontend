/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    //'./pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    extend: {
      minWidth: {
        screen: '1024px',
      },
      maxWidth: {
        screen: '1440px', // Custom max-width at 1440px
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        draftEmpty: {
          DEFAULT: 'hsl(var(--draft-empty))',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow))',
          hover: 'hsl(var(--yellow-hover))',
          text: 'hsl(var(--yellow-text))',
          transparent: 'hsl(var(--yellow-transparent))',
        },
        yellowSecond: {
          DEFAULT: 'hsl(var(--yellow-second))',
        },
        red: {
          DEFAULT: 'hsl(var(--red))',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue))',
        },
        boxShadow: {
          'yellow-glow': '0 0 20px rgba(255, 255, 0, 1)', // Adjust the values as needed
          'yellow-glow-10': '0 0 10px 5px rgba(255, 255, 0, 1)', // Adjust the values as needed
          'red-glow': '0 0 5px rgba(255, 0, 0, 0)', // Adjust the values as needed
        },
        transitionTimingFunction: {
          main: 'cubic-bezier(0,.45,.54,1)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
