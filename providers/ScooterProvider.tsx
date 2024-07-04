import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { supabase } from '~/lib/supabase';
import { DirectionResponse, getDirections } from '~/services/directions';

interface ScooterInterface {
  id: string
  lat: number
  long: number
  battery?: 0,
  dist_meters?: number
}

interface ContextInterface {
  nearbyScooters: ScooterInterface[]
  selectedScooter?: ScooterInterface
  setSelectedScooter: (value: ScooterInterface) => void
  direction?: DirectionResponse
  directionCoordinates?: Position[]
  duration?: number
  distance?: number
  isNearby?: boolean
}

const ScooterConterxt = createContext<ContextInterface>({
  nearbyScooters: [],
  setSelectedScooter: () => { }
});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearbyScooters] = useState([]);
  const [selectedScooter, setSelectedScooter] = useState<ScooterInterface | undefined>();
  const [direction, setDirection] = useState<DirectionResponse>();
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const fetchScooters = async () => {
      const location = await Location.getCurrentPositionAsync();
      const { error, data } = await supabase.rpc('nearby_scooters', {
        lat: location.coords.latitude,
        long: location.coords.longitude,
        max_dist_meters: 1000,
      });

      if (error) {
        Alert.alert('Failed to fetch scooters');
      } else {
        setNearbyScooters(data);
      }
    };

    fetchScooters();
  }, []);


  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    if (selectedScooter) {
      const watchLocation = async () => {
        subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
          const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
          const to = point([selectedScooter.long, selectedScooter.lat]);
          const distance = getDistance(from, to, { units: 'meters' });
          if (distance < 200) {
            setIsNearby(true);
          }
        });
      };

      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [selectedScooter]);

  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();

      if (selectedScooter) {
        const newDirection = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter?.long, selectedScooter?.lat]
        );
        setDirection(newDirection);
      }
    }

    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter])

  return (
    <ScooterConterxt.Provider value={{
      nearbyScooters,
      selectedScooter,
      setSelectedScooter,
      direction,
      directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
      duration: direction?.routes?.[0]?.duration,
      distance: direction?.routes?.[0]?.distance,
      isNearby,
    }}>
      {children}
    </ScooterConterxt.Provider>
  );
}

export const useScooter = () => useContext(ScooterConterxt);