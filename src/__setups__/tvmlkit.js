// We need to mock some TVMLKit objects to get Jest test to execute effectively

// Simulate the TVMLKit Device object
global.Device = {
  appIdentifier: 'APP_IDENTIFIER',
  appVersion: 'APP_VERSION',
};

// Simulate the TVMLKit Settings object
global.Settings = {
  language: 'en',
};

// Simulate the TVMLKit UUID function
global.UUID = () => Math.random();

