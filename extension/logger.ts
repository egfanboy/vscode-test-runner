import { window, OutputChannel } from 'vscode';
import packageTitle from './package-title';

class Logger {
  private _outlookChannel: OutputChannel | undefined;

  get logger(): OutputChannel {
    const logger = this._outlookChannel || window.createOutputChannel(packageTitle);

    return logger;
  }

  log(message: string): void {
    this.logger.appendLine(message);
  }

  destroy(): void {
    this._outlookChannel && this._outlookChannel.dispose();
  }
}

const logger = new Logger();

export default logger;
