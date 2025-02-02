import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    roots: ['<rootDir>/src/'],
    coverageDirectory: 'reports/coverage',
}

export default config
