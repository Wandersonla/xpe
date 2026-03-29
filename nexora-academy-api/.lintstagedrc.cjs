module.exports = {
  '*.{ts,js,json,md,yml,yaml}': ['prettier --write'],
  'src/**/*.ts': ['eslint --fix'],
  'test/**/*.ts': ['eslint --fix'],
};
