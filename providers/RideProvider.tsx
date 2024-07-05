import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "~/lib/supabase";
import { useAuth } from "./AuthProvider";

export interface Ride {
  id: number
  created_at: string
  finished_at: string | null
  scooter_id: number
  user_id: string
}

type RideContextType = {
  ride?: Ride
  isLoading: boolean
  startRide: (rideId: number) => void
  finishRide: () => void,
}

const RideContext = createContext<RideContextType>({
  ride: undefined,
  isLoading: false,
  startRide: (scooterId: number) => { },
  finishRide: () => { },
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<Ride | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .limit(1)
        .single();

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
  }, [])

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
      console.warn('Ride started');
      const currentRide = data[0] as Ride | undefined;
      setRide(currentRide);
    }
    setIsLoading(false);
  };

  const finishRide = async () => {
    if (!ride) {
      return;
    }

    const { error } = await supabase
      .from('rides')
      .update({
        finished_at: new Date(),
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
      isLoading,
      startRide,
      finishRide,
    }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);