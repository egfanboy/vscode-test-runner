const fs = require('fs');

module.exports = ({ rootPath, getConfiguration, showWarningMessage }) => {
  const config = getConfiguration();

  const prefferedPackageManager = config.get('test-runner.packageManager');

  if (prefferedPackageManager === 'yarn' || prefferedPackageManager === 'npm') {
    return prefferedPackageManager;
  } else if (prefferedPackageManager) {
    showWarningMessage(`The package manager (${prefferedPackageManager}) is not valid.
    It should be yarn or npm. You can fix this by changing your value in your settings "test-runner.packageManager"
    We will determine your package manager dynamically. `);
  }

  const usesYarn = fs.readdirSync(rootPath).filter(content => content.includes('yarn')).length > 0;

  return usesYarn ? 'yarn' : 'npm';
};
