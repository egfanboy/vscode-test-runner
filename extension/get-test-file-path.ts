import { workspace, window } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import logger from './logger';

const testFileRegex = /\.((spec)|(test))\.([jt]s)/;

const testFolderRegex = /^((spec\b)|(tests\b)|(__tests__\b))/;

const deriveTestFile = (directoryPath: string, fileName: string): string => {
  const potentialTestFiles = fs.readdirSync(directoryPath).filter(file => testFileRegex.test(file));

  logger.log(`Potential test for ${fileName}: ${potentialTestFiles.join(', ')}`);

  const { name: fileNameNoExt } = path.parse(fileName);
  const specificTestFile = potentialTestFiles.find(file => file.includes(fileNameNoExt));

  if (specificTestFile) {
    logger.log(`Found resulting test file for selected file: ${specificTestFile}`);
    return path.join(directoryPath, specificTestFile);
  }

  if (potentialTestFiles.length === 1) {
    logger.log(`Properly derived proper test file: ${potentialTestFiles[0]}`);
    return path.join(directoryPath, potentialTestFiles[0]);
  } else if (potentialTestFiles.length > 1) {
    const errorMessage = `There are too many potential test files. ${potentialTestFiles.join(
      ', '
    )}. Please run within the spec file`;

    window.showErrorMessage(errorMessage);
    logger.log(errorMessage);
  }

  return '';
};

export default (filePath: string): string | undefined => {
  if (!workspace.workspaceFolders) {
    return;
  }
  logger.log('Enter getTestFilePath');

  if (testFileRegex.test(filePath)) {
    logger.log(`Test file selected, simply return it ${filePath}`);
    return filePath;
  }

  const filePathParts = filePath.split('/');

  const fileName = filePathParts.pop() as string;

  const {
    uri: { fsPath },
  } = workspace.workspaceFolders[0];

  const directory = filePathParts.join('/');

  logger.log(`Looking for test files in directory: ${directory}`);

  const directoryFiles = fs.readdirSync(path.join(fsPath, directory));
  const hasTestDirectory = directoryFiles.some(file => testFolderRegex.test(file));

  if (hasTestDirectory) {
    logger.log('Test Directory (tests | __tests__ | spec) found. Looking in it for test files');

    const testDirectoryName = directoryFiles.find(file => testFolderRegex.test(file)) as string;

    return deriveTestFile(path.join(fsPath, directory, testDirectoryName), fileName);
  } else {
    logger.log('No test directory found. Looking in file directory');

    return deriveTestFile(path.join(fsPath, directory), fileName);
  }
};
