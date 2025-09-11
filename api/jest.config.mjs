export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/services/**'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 }
  },
  reporters: [ 'default', ['jest-junit', { outputDirectory: './coverage', outputName: 'junit.xml' }] ],
};

