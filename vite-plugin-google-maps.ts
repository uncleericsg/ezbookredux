import { Plugin } from 'vite';

export function googleMapsPlugin(apiKey: string): Plugin {
  return {
    name: 'vite-plugin-google-maps',
    transformIndexHtml(html) {
      return html.replace('%VITE_GOOGLE_PLACES_API_KEY%', apiKey);
    },
  };
}
