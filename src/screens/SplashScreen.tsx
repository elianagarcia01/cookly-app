import React, { useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const videoRef = useRef(null);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Video
        ref={videoRef}
        source={require('../assets/splash.mp4')}
        style={styles.video}
        resizeMode="cover"
        repeat={false}
        muted
        onEnd={() => navigation.replace('MainTabs')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { flex: 1 },
});
