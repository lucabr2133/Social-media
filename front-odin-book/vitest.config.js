/// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom', // o jsdom
    setupFiles: ['./vitest.setup.js'] // 👈 importa los matchers acá
  }
})
