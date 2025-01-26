import chokidar from 'chokidar';
import { EventEmitter } from 'node:events';
import { extname } from 'node:path';

export interface WatchOptions {
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
  private watchPaths: string[];

  constructor(paths: string[], options: WatchOptions = {}) {
    super();
    this.watchPaths = paths;
    this.watcher = chokidar.watch(paths, {
      ignored: options.ignored || /(^|[\/\\])\../,
      persistent: options.persistent ?? true,
      ignoreInitial: options.ignoreInitial ?? true
    });

    this.setupWatchers();
  }

  private setupWatchers() {
    this.watcher
      .on('add', path => this.emit('fileAdded', path))
      .on('change', path => this.emit('fileChanged', path))
      .on('unlink', path => this.emit('fileRemoved', path))
      .on('error', error => this.emit('error', error));
  }

  public async watchTypeChanges(
    onChange: (path: string) => Promise<void>
  ): Promise<void> {
    this.on('fileChanged', async (filePath: string) => {
      if (extname(filePath) === '.ts') {
        try {
          await onChange(filePath);
        } catch (error) {
          this.emit('error', error instanceof Error ? error : new Error(String(error)));
        }
      }
    });
  }

  public getWatchedPaths(): string[] {
    return this.watchPaths;
  }

  public async close(): Promise<void> {
    await this.watcher.close();
    this.removeAllListeners();
  }

  // Type-safe event emitter
  public on<K extends keyof TypeWatcherEvents>(
    event: K,
    listener: TypeWatcherEvents[K]
  ): this {
    return super.on(event, listener);
  }

  public emit<K extends keyof TypeWatcherEvents>(
    event: K,
    ...args: Parameters<TypeWatcherEvents[K]>
  ): boolean {
    return super.emit(event, ...args);
  }
}

export const createTypeWatcher = (
  paths: string[],
  options?: WatchOptions
): TypeWatcher => {
  return new TypeWatcher(paths, options);
};

// Example usage:
/*
const watcher = createTypeWatcher(['src/**/*.ts']);

watcher.watchTypeChanges(async (path) => {
  console.log(`File changed: ${path}`);
  // Perform type analysis
});

watcher.on('error', (error) => {
  console.error('Watch error:', error);
});
*/ 