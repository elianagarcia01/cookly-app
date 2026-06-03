import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initDatabase } from './src/database/database';
import AppNavigator from './src/navigation/AppNavigator';
import { startFavoritesService } from './src/services/FavoritesServiceBridge';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import NoConnectionScreen from './src/screens/NoConnectionScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  const { isConnected, recheckConnection } = useNetworkStatus();

  useEffect(() => {
    initDatabase();
    startFavoritesService();
  }, []);

  if (isConnected === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  if (!isConnected) {
    return <NoConnectionScreen onRetry={recheckConnection} />;
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
