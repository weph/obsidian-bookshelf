import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        setupFiles: ['./src/support/vitest-setup.ts'],
        environment: 'jsdom',
        coverage: {
            reportsDirectory: './reports/coverage',
        },
    },
})
