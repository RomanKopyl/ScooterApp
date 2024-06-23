import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { useScooter } from '~/providers/ScooterProvider';
import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY ?? '');

export default function Map() {
  const { directionCoordinates } = useScooter();

  return (
    <MapView
      style={{ flex: 1 }}
      styleURL='mapbox://styles/mapbox/dark-v11'
    >
      <Camera followZoomLevel={13} followUserLocation />

      <LocationPuck
        puckBearingEnabled
        puckBearing='heading'
        pulsing={{ isEnabled: true }}
      />

      <ScooterMarkers />

      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
    </MapView >
  );
}