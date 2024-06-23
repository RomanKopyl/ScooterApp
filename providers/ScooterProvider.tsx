import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { DirectionResponse, getDirections } from '~/services/directions';

interface ScooterInterface {
  id: string
  lat: number
  long: number
}

interface ContextInterface {
  selectedScooter?: ScooterInterface
  setSelectedScooter: (value: ScooterInterface) => void
  direction?: DirectionResponse
  directionCoordinates?: Position[]
  routeTime?: number
  routeDistance?: number
}

const ScooterConterxt = createContext<ContextInterface>({
  setSelectedScooter: () => { }
});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState<ScooterInterface | undefined>();
  const [direction, setDirection] = useState<DirectionResponse>();

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
      selectedScooter,
      setSelectedScooter,
      direction,
      directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
      routeTime: direction?.routes?.[0]?.duration,
      routeDistance: direction?.routes?.[0]?.distance,
    }}>
      {children}
    </ScooterConterxt.Provider>
  );
}

export const useScooter = () => useContext(ScooterConterxt);