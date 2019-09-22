import * as fs from 'fs';
import * as path from 'path';
import { window } from 'vscode';

export default function(rootPath: string, pathToFile: string): string | undefined {
  const filePaths = pathToFile.split('/');

  // Last element is always a file so remove it
  filePaths.pop();

  const rootHasPackageJSON = fs.readdirSync(rootPath).includes('package.json');

  const nestedDirectory = filePaths.reduce((acc: string, directoryName) => {
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
}
