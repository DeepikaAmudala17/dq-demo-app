import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const LOG_FILE = path.join(os.tmpdir(), 'todo-api-events.log');

export function logEvent(message: string): void {
  const fd = fs.openSync(LOG_FILE, 'a');
  fs.writeSync(fd, `${new Date().toISOString()} ${message}\n`);
  fs.closeSync(fd);
}
