export class NetworkUtils {
  static isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return true;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      return true;
    }
    return !this.isOnline();
  }

  static async checkConnectivity(url: string = 'https://www.google.com'): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      return true;
    } catch {
      return false;
    }
  }
} 