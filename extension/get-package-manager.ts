import { workspace, window } from 'vscode';
import * as fs from 'fs';
import logger from './logger';

export default (cwd?: string): string => {
  const config = workspace.getConfiguration();

  logger.log('Attempting to determine your package manager');

  const prefferedPackageManager = config.get('test-runner.packageManager');

  if (prefferedPackageManager === 'yarn' || prefferedPackageManager === 'npm') {
    logger.log(`Found proper package manager from settings: ${prefferedPackageManager}`);
    return prefferedPackageManager;
  } else if (prefferedPackageManager) {
    window.showWarningMessage(`The package manager (${prefferedPackageManager}) is not valid.
    It should be yarn or npm. You can fix this by changing your value in your settings "test-runner.packageManager"
    We will determine your package manager dynamically. `);
  }

  const usesYarn = fs.readdirSync(cwd || '').filter((content: string) => content.includes('yarn')).length > 0;

  const packageManager = usesYarn ? 'yarn' : 'npm';

  logger.log(`Determined that you use: ${packageManager}`);

  return packageManager;
};
