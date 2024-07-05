import { Stack } from 'expo-router';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import Map from '../../components/Map';
import ActiveRideSheet from '~/components/ActiveRideSheet';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      {/* <Button title="Sign out" onPress={() => supabase.auth.signOut()} /> */}

      <SelectedScooterSheet />
      <ActiveRideSheet />
    </>
  );
}
