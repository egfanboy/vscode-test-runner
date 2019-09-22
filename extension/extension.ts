import { window, commands, workspace, Terminal, Disposable } from 'vscode';

import packageTitle from './package-title';
import logger from './logger';

import getTestFilePath from './get-test-file-path';

import getPackageManager from './get-package-manager';
import getCwd from './get-cwd';

let terminal: Terminal | undefined;
let packageManager: string;
let configWatcher: Disposable;

const PKG_COMMANDS: { [key: string]: string } = {
  yarn: 'yarn',
  npm: 'npm run',
};

let previousCwd = '';

function getPkgCommand(): string {
  return PKG_COMMANDS[packageManager];
}

export function activate(context: { subscriptions: Disposable[] }) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.testFile', () => {
    if (!workspace.workspaceFolders || !window.activeTextEditor) {
      return;
    }

    if (!configWatcher)
      configWatcher = workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('test-runner')) {
          packageManager = getPackageManager();
        }
      });

    window.onDidCloseTerminal(closedTerminal => {
      if (closedTerminal === terminal) terminal = undefined;
    });

    const {
      uri: { fsPath },
    } = workspace.workspaceFolders[0];

    const cwd = getCwd(fsPath, workspace.asRelativePath(window.activeTextEditor.document.uri));

    if (!cwd) {
      return;
    }

    if (previousCwd && cwd !== previousCwd) {
      logger.log('Cwd changed, deleting current terminal');
      terminal && terminal.dispose();
      terminal = undefined;
    }

    if (cwd !== previousCwd) {
      packageManager = getPackageManager(cwd);
    }

    terminal =
      terminal ||
      window.createTerminal({
        name: packageTitle,
        cwd,
      });

    previousCwd = cwd;

    const testFilePath = getTestFilePath(workspace.asRelativePath(window.activeTextEditor.document.uri));

    if (testFilePath) {
      const fullTestFilePathParts = testFilePath.split('/');
      const cwdName = cwd.split('/').pop();
      const relativeCwdIndex = fullTestFilePathParts.findIndex((part: any) => part === cwdName);

      const relativeTestFilePath = fullTestFilePathParts.slice(relativeCwdIndex + 1).join('/');

      terminal.show(true);
      terminal.sendText(`${getPkgCommand()} test ${relativeTestFilePath}`);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  configWatcher && configWatcher.dispose();
  terminal && terminal.dispose();
  logger.destroy();
}
