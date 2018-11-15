const { window, commands, workspace } = require('vscode');
const fs = require('fs');
const path = require('path');

const getPackageManager = require('./get-package-manager');

let terminal;
let packageManager;

const PKG_COMMANDS = {
  yarn: 'yarn',
  npm: 'npm run',
};

function getPkgCommand() {
  return PKG_COMMANDS[packageManager];
}

function getVersion() {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
  ).version;
}

const terminalTitle = `Jest Test Runner v${getVersion()}`;

function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.testFile', () => {
    if (!packageManager) {
      packageManager = getPackageManager(workspace.rootPath);
    }

    terminal = terminal || window.createTerminal(terminalTitle);
    terminal.show(true);
    terminal.sendText(
      `${getPkgCommand()} test ${workspace.asRelativePath(
        window.activeTextEditor.document.uri
      )}`
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
