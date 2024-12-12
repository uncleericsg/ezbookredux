export class NetworkUtils {
  private static retryCount = 3;
  private static retryDelay = 1000; // 1 second

  static async waitForConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve(true);
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve(true);
      };

      window.addEventListener('online', handleOnline);
    });
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = NetworkUtils.retryCount
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Check network connection before attempt
        if (!navigator.onLine) {
          console.log(`Attempt ${attempt}: Waiting for network connection...`);
          await NetworkUtils.waitForConnection();
        }

        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.log(`Attempt ${attempt} failed:`, lastError.message);

        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => 
            setTimeout(resolve, NetworkUtils.retryDelay * attempt)
          );
        }
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  static isNetworkError(error: any): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('network') ||
        error.message.includes('internet') ||
        error.message.includes('offline') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')
      );
    }
    return false;
  }
}
