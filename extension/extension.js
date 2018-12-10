const { window, commands, workspace } = require('vscode');

const { version } = require('../package.json');
const getTestFilePath = require('./get-test-file-path');

const getPackageManager = require('./get-package-manager');
const getCwd = require('./get-cwd');

let terminal;
let packageManager;

const PKG_COMMANDS = {
  yarn: 'yarn',
  npm: 'npm run',
};

const terminalTitle = `Jest Test Runner v${version}`;
let previousCwd = '';

function getPkgCommand() {
  return PKG_COMMANDS[packageManager];
}

function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.testFile', () => {
    if (!packageManager) {
      packageManager = getPackageManager(workspace.rootPath);
    }

    window.onDidCloseTerminal(closedTerminal => {
      if (closedTerminal === terminal) terminal = undefined;
    });

    const cwd = getCwd(
      workspace.rootPath,
      workspace.asRelativePath(window.activeTextEditor.document.uri)
    );

    if (previousCwd && cwd !== previousCwd) {
      terminal && terminal.dispose();
      terminal = undefined;
    }

    terminal =
      terminal ||
      window.createTerminal({
        name: terminalTitle,
        cwd,
      });

    previousCwd = cwd;

    const cwdRoot = cwd.split('/').pop();
    /* ${getTestFilePath(filePath).replace(
        `${cwdRoot}/`,
        ''
      )*/
    terminal.show(true);
    terminal.sendText(
      `${getPkgCommand()} test ${getTestFilePath(
        workspace.asRelativePath(window.activeTextEditor.document.uri)
      ).replace(`${cwdRoot}/`, '')}`
    );
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
  terminal && terminal.dispose();
}

exports.activate = activate;
exports.deactivate = deactivate;
