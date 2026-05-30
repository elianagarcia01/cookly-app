import { NativeModules, Platform } from 'react-native';

export const startFavoritesService = (): void => {
  if (Platform.OS === 'android') {
    NativeModules.FavoritesServiceModule?.start();
  }
};