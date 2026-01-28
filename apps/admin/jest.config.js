const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/.next/**', '!**/coverage/**'],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    }
};

export default config;
