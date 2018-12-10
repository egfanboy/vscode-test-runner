const { workspace } = require('vscode');
const fs = require('fs');
const path = require('path');

module.exports = filePath => {
  if (filePath.includes('.spec.js') || filePath.includes('.test.js'))
    return filePath;

  const fileName = filePath.split('/').pop();

  const directory = filePath
    .split('/')
    .filter(el => el !== fileName)
    .join('/');

  const directoryFiles = fs.readdirSync(
    path.join(workspace.rootPath, directory)
  );

  let testDir = '';

  if (directoryFiles.includes('tests')) {
    testDir = 'tests';
  } else if (directoryFiles.includes('__tests__')) {
    testDir = '__tests__';
  } else if (directoryFiles.includes('spec')) {
    testDir = 'spec';
  }

  const testDirFiles = fs.readdirSync(
    path.join(workspace.rootPath, directory, testDir)
  );

  const testFile = testDirFiles.find(file => {
    return (
      fileName.replace('.js', '.spec.js') === file ||
      fileName.replace('.js', '.test.js') === file
    );
  });

  if (testFile) {
    const filePathParts = filePath.split('/');

    filePathParts.splice(filePathParts.length - 1, 0, testDir);

    console.log(filePathParts);
    return filePathParts.join('/').replace(fileName, testFile);
  } else return filePath;
};
