import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  theme: {
    colors: {
      ink: {
        50: '#f8f9fa',
        100: '#e9ecef',
        200: '#dee2e6',
        300: '#ced4da',
        400: '#adb5bd',
        500: '#6c757d',
        600: '#495057',
        700: '#343a40',
        800: '#212529',
        900: '#1a1d20'
      },
      paper: {
        50: '#fefefe',
        100: '#fdfcf8',
        200: '#faf8f0',
        300: '#f5f2e8',
        400: '#f0ede0',
        500: '#ebe8d8'
      },
      gold: {
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#f59e0b',
        500: '#d97706'
      }
    },
    fontFamily: {
      serif: ['Noto Serif SC', 'serif'],
      mono: ['JetBrains Mono', 'monospace']
    }
  },
  shortcuts: {
    'btn-primary': 'px-4 py-2 bg-ink-800 text-paper-100 rounded-lg hover:bg-ink-700 transition-colors cursor-pointer border border-ink-600',
    'btn-secondary': 'px-4 py-2 bg-paper-200 text-ink-800 rounded-lg hover:bg-paper-300 transition-colors cursor-pointer border border-ink-300',
    'card': 'bg-paper-100 border border-ink-300 rounded-lg p-4 shadow-sm',
    'input-field': 'px-3 py-2 border border-ink-300 rounded-lg bg-paper-50 focus:outline-none focus:border-ink-500 transition-colors',
    'text-primary': 'text-ink-800',
    'text-secondary': 'text-ink-600',
    'text-muted': 'text-ink-500'
  }
})
