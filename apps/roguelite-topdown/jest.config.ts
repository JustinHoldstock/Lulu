module.exports = {
  displayName: 'roguelite-topdown',
  preset: '../../jest.preset.ts',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/roguelite-topdown',
};
