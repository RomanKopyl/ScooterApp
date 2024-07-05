import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "~/lib/supabase";
import { useAuth } from "./AuthProvider";
import { fetchDirectionBasedOnCoords } from '~/services/directions';

export interface Ride {
  id: number
  created_at: string
  finished_at: string | null
  scooter_id: number
  user_id: string
}

type RideContextType = {
  ride?: Ride
  rideRoute: Position[]
  isLoading: boolean
  startRide: (rideId: number) => void
  finishRide: () => void,
}

const RideContext = createContext<RideContextType>({
  ride: undefined,
  rideRoute: [],
  isLoading: false,
  startRide: (scooterId: number) => { },
  finishRide: () => { },
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<Ride | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [rideRoute, setRideRoute] = useState<Position[]>([]);

  const { userId } = useAuth();

  // Fetch active ride if it exist
  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .limit(1)
        .single();

      // ERROR 
      // "code": "PGRST116", 
      // "details": "The result contains 0 rows"
      if (error && error.code !== 'PGRST116') {
        console.log('ERROR', error);

        Alert.alert("Something went wrong");
        return;
      }

      if (data) {
        setRide(data);
      }
    };

    fetchActiveRide();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    if (ride) {
      const watchLocation = async () => {
        subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
          console.log('New location: ', newLocation.coords.longitude, newLocation.coords.latitude);
          setRideRoute(currRoute => [
            ...currRoute,
            [newLocation.coords.longitude, newLocation.coords.latitude],
          ]);
          // const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
          // const to = point([selectedScooter.long, selectedScooter.lat]);
          // const distance = getDistance(from, to, { units: 'meters' });
          // if (distance < 500) {
          //   setIsNearby(true);

          // }
        });
      };

      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [ride]);


  const startRide = async (scooterId: number) => {
    if (ride) {
      Alert.alert("Cannot start anew ride while another one is in progress");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('rides')
      .insert([
        {
          user_id: userId,
          scooter_id: scooterId,
        },
      ])
      .select();

    if (error) {
      Alert.alert("Failed to start the ride");
    } else {
      const currentRide = data[0] as Ride | undefined;
      setRide(currentRide);
    }
    setIsLoading(false);
  };

  const finishRide = async () => {
    if (!ride) {
      return;
    }

    const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
    const rideRouteCoords = actualRoute.matchings[0].geometry.coordinates;
    const rideRouteDuration = actualRoute.matchings[0].duration;
    const rideRouteDistance = actualRoute.matchings[0].distance;
    setRideRoute(actualRoute.matchings[0].geometry.coordinates);


    const { error } = await supabase
      .from('rides')
      .update({
        finished_at: new Date(),
        routeDuration: rideRouteDuration,
        routeDistance: rideRouteDistance,
        routeCoords: rideRouteCoords,
      })
      .eq('id', ride?.id);

    if (error) {
      Alert.alert("Failed to finish the ride");
    } else {
      setRide(undefined);
    }
  };

  console.log('Current ride: ', ride);


  return (
    <RideContext.Provider value={{
      ride,
      rideRoute,
      isLoading,
      startRide,
      finishRide,
    }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);