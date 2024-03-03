import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'CryptoApp',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
