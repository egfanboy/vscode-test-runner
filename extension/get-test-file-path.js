const { workspace } = require('vscode');
const fs = require('fs');
const path = require('path');

const testFileRegex = /(\w*).((spec\b)|(test\b))\.([jt]s)/;

const testFolderRegex = /^((spec\b)|(tests\b)|(__tests__\b))/;

module.exports = ({ filePath, outlookChannel, showErrorMessage }) => {
  outlookChannel.appendLine('Enter getTestFilePath');

  if (testFileRegex.test(filePath)) {
    outlookChannel.appendLine(`Test file selected, simply return it ${filePath}`);
    return filePath;
  }

  const fileName = filePath.split('/').pop();

  const directory = filePath
    .split('/')
    .filter(el => el !== fileName)
    .join('/');

  outlookChannel.appendLine(`Looking for test files in directory: ${directory}`);

  const directoryFiles = fs.readdirSync(path.join(workspace.rootPath, directory));
  const hasTestDirectory = directoryFiles.some(file => testFolderRegex.test(file));

  if (hasTestDirectory) {
    outlookChannel.appendLine('Test Directory (tests | __tests__ | spec) found. Looking in it for test files');

    const testDirectoryName = directoryFiles.find(file => testFolderRegex.test(file));
    const testDirectoryContent = fs.readdirSync(path.join(workspace.rootPath, directory, testDirectoryName));
    const potentialTestFiles = testDirectoryContent.filter(file => testFileRegex.test(file));
    const { name: fileNameNoExt } = path.parse(fileName);
    const specificTestFile = potentialTestFiles.find(file => file.includes(fileNameNoExt));

    if (specificTestFile) {
      outlookChannel.appendLine(`Found resulting test file for selected file: ${specificTestFile}`);
      return path.join(directory, testDirectoryName, specificTestFile);
    }

    if (potentialTestFiles.length > 1) {
      const errorMessage = `There are too many potential test files. ${potentialTestFiles.join(
        ', '
      )}. Please run within the spec file`;

      showErrorMessage(errorMessage);
      outlookChannel.appendLine(errorMessage);
    } else if (potentialTestFiles.length === 1) {
      outlookChannel.appendLine(`Properly derived proper test file: ${potentialTestFiles[0]}`);
      return path.join(directory, testDirectoryName, potentialTestFiles[0]);
    }
  } else {
    outlookChannel.appendLine('No test directory found. Looking in file directory');

    const potentialTestFiles = directoryFiles.filter(file => testFileRegex.test(file));
    const { name: fileNameNoExt } = path.parse(fileName);
    const specificTestFile = potentialTestFiles.find(file => file.includes(fileNameNoExt));

    if (specificTestFile) {
      outlookChannel.appendLine(`Found resulting test file for selected file: ${specificTestFile}`);
      return path.join(directory, specificTestFile);
    }

    if (potentialTestFiles.length === 1) {
      outlookChannel.appendLine(`Properly derived proper test file: ${potentialTestFiles[0]}`);
      return path.join(directory, potentialTestFiles[0]);
    } else if (potentialTestFiles.length > 1) {
      const errorMessage = `There are too many potential test files. ${potentialTestFiles.join(
        ', '
      )}. Please run within the spec file`;

      showErrorMessage(errorMessage);
      outlookChannel.appendLine(errorMessage);
    }
  }
};
