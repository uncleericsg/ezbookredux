import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';

export interface WatchOptions {
  paths: string[];
  ignored?: string[];
  persistent?: boolean;
  ignoreInitial?: boolean;
}

export interface TypeWatcherEvents {
  fileAdded: (path: string) => void;
  fileChanged: (path: string) => void;
  fileRemoved: (path: string) => void;
  error: (error: Error) => void;
}

export class TypeWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher;

  constructor(options: WatchOptions) {
    super();
    this.watcher = chokidar.watch(options.paths, {
      ignored: options.ignored || ['**/node_modules/**', '**/.git/**'],
      persistent: options.persistent !== false,
      ignoreInitial: options.ignoreInitial !== false
    });

    this.setupWatchers();
  }

  private setupWatchers(): void {
    this.watcher
      .on('add', (path) => this.emit('fileAdded', path))
      .on('change', (path) => this.emit('fileChanged', path))
      .on('unlink', (path) => this.emit('fileRemoved', path))
      .on('error', (error) => this.emit('error', error));
  }

  close(): Promise<void> {
    return this.watcher.close();
  }
}

export function createTypeWatcher(options: WatchOptions): TypeWatcher {
  return new TypeWatcher(options);
} 