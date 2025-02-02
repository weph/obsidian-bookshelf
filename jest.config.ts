import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    roots: ['<rootDir>/src/'],
    coverageDirectory: 'reports/coverage',
    injectGlobals: false,
    setupFilesAfterEnv: ['<rootDir>/src/support/jest-setup.ts'],
}

export default config
