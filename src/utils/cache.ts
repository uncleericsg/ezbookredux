import { Region } from '@services/locations/regions';
import type { TimeSlot } from '@types';

interface CacheEntry {
  slots: TimeSlot[];
  timestamp: number;
  region: Region;
  params: Record<string, unknown>;
}

class CacheWarmer {
  private static instance: CacheWarmer;
  private warming = false;
  private queue: Array<() => Promise<void>> = [];
  private worker: Worker | null = null;

  private constructor() {
    if (typeof Worker !== 'undefined') {
      this.initializeWorker();
    }
  }

  static getInstance(): CacheWarmer {
    if (!CacheWarmer.instance) {
      CacheWarmer.instance = new CacheWarmer();
    }
    return CacheWarmer.instance;
  }

  private initializeWorker() {
    const workerCode = `
      self.onmessage = async (e) => {
        const { regions, date } = e.data;
        for (const region of regions) {
          // Simulate optimization work
          await new Promise(resolve => setTimeout(resolve, 100));
          self.postMessage({ region, status: 'completed' });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (e) => {
      console.log('Cache warmed for region:', e.data.region);
    };
  }

  async warmCache(regions: Region[], date: Date): Promise<void> {
    if (this.warming) {
      // Queue the warming request
      return new Promise((resolve) => {
        this.queue.push(async () => {
          await this.performWarm(regions, date);
          resolve();
        });
      });
    }

    return this.performWarm(regions, date);
  }

  private async performWarm(regions: Region[], date: Date): Promise<void> {
    this.warming = true;

    try {
      if (this.worker) {
        // Use web worker for background processing
        this.worker.postMessage({ regions, date });
      } else {
        // Fallback to main thread processing
        for (const region of regions) {
          await this.warmRegion(region, date);
        }
      }
    } finally {
      this.warming = false;
      // Process next in queue
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }

  private async warmRegion(region: Region, date: Date): Promise<void> {
    // Implement actual cache warming logic here
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.queue = [];
  }
}

export const cacheWarmer = CacheWarmer.getInstance();
