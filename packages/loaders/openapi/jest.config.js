module.exports = {
	rootDir: '.',
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: './src/.*\\.test\\.ts$',
	testPathIgnorePatterns: [],
	testEnvironment: 'node',
	preset: 'ts-jest',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: [
		// Include rules
		'./src/**/*.(t|j)s',
		// Exclude rules
	],
	coverageDirectory: './coverage',
	coverageReporters: ['json', 'lcov'],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
};
