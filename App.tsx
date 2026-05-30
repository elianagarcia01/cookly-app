import React, { useEffect } from 'react';
import { DeviceEventEmitter, ToastAndroid } from 'react-native';
import { initDatabase } from './src/database/database';
import AppNavigator from './src/navigation/AppNavigator';
import { startFavoritesService } from './src/services/FavoritesServiceBridge';

export default function App() {
  useEffect(() => {
    initDatabase();
    startFavoritesService();

    const subscription = DeviceEventEmitter.addListener(
      'networkStatusChanged',
      (isConnected: boolean) => {
        if (!isConnected) {
          ToastAndroid.show('Sin conexión a internet', ToastAndroid.LONG);
        } else {
          ToastAndroid.show('Conexión restaurada', ToastAndroid.SHORT);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return <AppNavigator />;
}