import { useCallback, useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected ?? true);
  }, []);

  useEffect(() => {
    checkConnection();

    const module = NativeModules.NetworkEventEmitter;
    if (!module?.addListener || !module?.removeListeners) return;

    const emitter = new NativeEventEmitter(module);
    const subscription = emitter.addListener('networkStatusChanged', (connected: boolean) => {
      setIsConnected(connected);
    });

    return () => subscription.remove();
  }, [checkConnection]);

  return { isConnected, recheckConnection: checkConnection };
}
