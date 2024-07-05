import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Text, View } from 'react-native';
import { useRide } from "~/providers/RideProvider";
import { Button } from "./Button";

export default function ActiveRideSheet() {
  const { ride, isLoading, finishRide } = useRide();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#414442' }}
    >
      {
        ride &&
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          <Text>ride in progress</Text>
          <View>
            <Button
              title="Finish journey"
              onPress={() => finishRide()}
              disabled={isLoading}
              isLoading={isLoading} />
          </View>
        </BottomSheetView>
      }
    </BottomSheet>
  );
}