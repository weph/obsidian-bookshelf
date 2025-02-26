import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
        '^.+\\.jsx?$': [
            'babel-jest',
            {
                presets: ['@babel/preset-env'],
                plugins: [['@babel/transform-runtime']],
            },
        ],
    },
    roots: ['<rootDir>/src/'],
    coverageDirectory: 'reports/coverage',
    injectGlobals: false,
    setupFilesAfterEnv: ['<rootDir>/src/support/jest-setup.ts'],
    transformIgnorePatterns: ['node_modules/(?!lit|@lit)'],
}

export default config
