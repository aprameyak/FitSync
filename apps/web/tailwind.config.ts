import type { Config } from 'tailwindcss'
import shared from '@fitsync/tailwind-config/tailwind.config'

export default {
  presets: [shared],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ]
} satisfies Config
