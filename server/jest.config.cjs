module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["tsx", {}]
    },
    testMatch: [
        "**/tests/**/*.test.ts"
    ]
};