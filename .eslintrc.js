module.exports = {
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
  ],
  globals: {
    Settings: true,
    Device: true,
    UUID: true,
  },
  env: {
    "browser": true,
  },
  rules: {
    'no-console': [0], // turned off for now while we are console.logging everywhere.
  }    
};