const fs = require('fs');
const path = require('path');

module.exports = function(rootPath, pathToFile) {
  const filePaths = pathToFile.split('/');

  if (fs.readdirSync(rootPath).includes('package.json')) return rootPath;

  return filePaths.reduce((acc, directoryName, index) => {
    if (acc) return acc;
    const dirFiles = fs.readdirSync(
      path.join(rootPath, filePaths.slice(0, index + 1).join('/'))
    );
    if (dirFiles.includes('package.json'))
      acc = path.join(rootPath, directoryName);

    return acc;
  }, '');
};
