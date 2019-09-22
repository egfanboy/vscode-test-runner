const fs = require('fs');
const path = require('path');
const { window } = require('vscode');

module.exports = function(rootPath, pathToFile) {
  const filePaths = pathToFile.split('/');

  // Last element is always a file so remove it
  filePaths.pop();

  const rootHasPackageJSON = fs.readdirSync(rootPath).includes('package.json');

  const nestedDirectory = filePaths.reduce((acc, directoryName) => {
    const directoryIndex = filePaths.findIndex(p => p === directoryName);

    const restOfFilePaths = filePaths.slice(0, directoryIndex);

    const dirFiles = fs.readdirSync(path.join(rootPath, ...restOfFilePaths, directoryName));
    if (dirFiles.includes('package.json')) {
      acc = path.join(rootPath, ...restOfFilePaths, directoryName);
    }

    return acc;
  }, '');

  if (nestedDirectory) return nestedDirectory;
  if (rootHasPackageJSON) return rootPath;

  window.showErrorMessage(`None of the following directories contain a package.json. ${filePaths.join(', ')}`);
};
