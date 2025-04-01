// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    _comment:
        "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
    $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress", "dashboard"],
    testRunner: "jest",
    testRunner_comment:
        "Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.",
    coverageAnalysis: "perTest",
    jest: {
        projectType: "custom",
        configFile: "jest.config.js",
    },
    mutate: [
        "src/app/armor/*.tsx",
        "src/app/armor/components/armorResult/*.tsx",
        "src/app/armor/components/customSortBy/*.tsx",
        // TODO: add more here
    ],
    thresholds: {
        high: 90,
        low: 70,
        break: 60,
    },
    timeoutMS: 5000,
    concurrency: 4,
    checkers: ["typescript"],
};
export default config;
