import { Stack } from 'expo-router';

import Map from '../components/Map';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <StatusBar style="light" />
    </>
  );
}
