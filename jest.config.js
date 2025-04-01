const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "@stryker-mutator/jest-runner/jest-env/jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/app/$1", // Adjust this if your alias is different
    },
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/__tests__/**/*.test.tsx"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

module.exports = createJestConfig(customJestConfig);
