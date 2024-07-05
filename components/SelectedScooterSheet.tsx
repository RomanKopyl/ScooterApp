import { FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import { scooterImage } from '~/assets';
import { useRide } from '~/providers/RideProvider';
import { useScooter } from '~/providers/ScooterProvider';
import { Button } from './Button';

export default function SelectedScooterSheet() {
  const {
    selectedScooter,
    duration = 0,
    distance = 0,
    isNearby,
    setSelectedScooter,
  } = useScooter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { startRide, isLoading } = useRide();

  useEffect(() => {
    if (selectedScooter) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [selectedScooter]);


  const startJourney = async () => {
    if (!selectedScooter?.id) return;

    startRide(selectedScooter?.id);
    setSelectedScooter(undefined);
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      onClose={() => setSelectedScooter(undefined)}
      backgroundStyle={{ backgroundColor: '#414442' }}
    >
      {selectedScooter && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          {/* TOP part */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={scooterImage} style={{ width: 60, height: 60 }} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Lime - S</Text>
              <Text style={{ color: 'gray', fontSize: 18 }}>
                id-{selectedScooter.id} · Madison Avenue
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(distance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="clock" size={18} color="#42E100" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(duration / 60).toFixed(0)} min
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom part */}
          <View>
            <Button
              title="Start journey"
              onPress={startJourney}
              disabled={!isNearby || isLoading}
              isLoading={isLoading} />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}