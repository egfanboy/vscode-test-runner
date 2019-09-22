const { window, commands, workspace } = require('vscode');

const packageTitle = require('./package-title');
const logger = require('./logger');

const getTestFilePath = require('./get-test-file-path');

const getPackageManager = require('./get-package-manager');
const getCwd = require('./get-cwd');

let terminal;
let packageManager;
let configWatcher;

const PKG_COMMANDS = {
  yarn: 'yarn',
  npm: 'npm run',
};

let previousCwd = '';

function getPkgCommand() {
  return PKG_COMMANDS[packageManager];
}

function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.testFile', () => {
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
      const relativeCwdIndex = fullTestFilePathParts.findIndex(part => part === cwdName);

      const relativeTestFilePath = fullTestFilePathParts.slice(relativeCwdIndex + 1).join('/');

      terminal.show(true);
      terminal.sendText(`${getPkgCommand()} test ${relativeTestFilePath}`);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
  configWatcher && configWatcher.dispose();
  terminal && terminal.dispose();
  logger.destroy();
}

exports.activate = activate;
exports.deactivate = deactivate;
