const { window } = require('vscode');
const packageTitle = require('./package-title');

class Logger {
  constructor() {
    this._outlookChannel = window.createOutputChannel(packageTitle);
  }

  get logger() {
    const logger = this._outlookChannel;

    return logger;
  }

  log(message) {
    this.logger.appendLine(message);
  }

  destroy() {
    this._outlookChannel && this._outlookChannel.dispose();
  }
}

const logger = new Logger();

module.exports = logger;
