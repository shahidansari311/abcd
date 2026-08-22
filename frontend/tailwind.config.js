export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': 'var(--color-primary-dark)',
        'secondary-dark': 'var(--color-secondary-dark)',
        light: 'var(--color-light)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          200: 'var(--color-accent-200)',
          400: 'var(--color-accent-400)',
          600: 'var(--color-accent-600)',
          800: 'var(--color-accent-800)',
        },
      },
      fontFamily: {
        base: ['Basic', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: 'var(--text-display)',
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        h4: 'var(--text-h4)',
        'body-lg': 'var(--text-body-lg)',
        body: 'var(--text-body)',
        'body-sm': 'var(--text-body-sm)',
        caption: 'var(--text-caption)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '180ms',
        base: '280ms',
        slow: '450ms',
        deliberate: '700ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-soft': 'cubic-bezier(0.7, 0, 0.84, 0)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
