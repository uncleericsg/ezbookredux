export interface AppSettings {
  loginScreenEnabled: boolean;
  // Add other app-level settings here
}

export const defaultAppSettings: AppSettings = {
  loginScreenEnabled: false
};
