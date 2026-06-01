import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!NativeModules.NetworkEventEmitter) return;

    const emitter = new NativeEventEmitter(NativeModules.NetworkEventEmitter);
    const subscription = emitter.addListener('networkStatusChanged', (connected: boolean) => {
      setIsConnected(connected);
    });

    return () => subscription.remove();
  }, []);

  return isConnected;
}
