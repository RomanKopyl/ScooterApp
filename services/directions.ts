import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";

const BASE_URL = 'https://api.mapbox.com';

export interface DirectionResponse {
  routes?: [
    {
      geometry: { coordinates: Position[] }
      duration: number
      distance: number
    }
  ]
}

export async function getDirections(from: number[], to: number[]): Promise<DirectionResponse | undefined> {
  const response = await fetch(
    `${BASE_URL}/directions/v5/mapbox/cycling/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
  );

  const json = await response.json();
  return json;
}

export async function fetchDirectionBasedOnCoords(coordinates: Position[]) {
  const coordinatesString = coordinates.map((coord: any[]) => `${coord[0]},${coord[1]}`).join(';');
  const response = await fetch(
    `${BASE_URL}/matching/v5/mapbox/cycling/${coordinatesString}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
  );

  const json = await response.json();
  return json;
}