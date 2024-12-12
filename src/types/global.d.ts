declare global {
  interface Window {
    initGoogleMaps: () => void;
    google: typeof google;
  }
}

export {};
