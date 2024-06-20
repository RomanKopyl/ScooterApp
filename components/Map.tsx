import Mapbox, { Camera, Images, LocationPuck, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import pin from '~/assets/pin.png';
import scooters from '~/data/scooter.json';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY ?? '');

export default function Map() {
  const points = scooters.map(i => point([i.long, i.lat]));

  return <MapView
    style={{ flex: 1 }}
    styleURL='mapbox://styles/mapbox/dark-v11'
  >
    <Camera followZoomLevel={14} followUserLocation />
    <LocationPuck
      puckBearingEnabled
      puckBearing='heading'
      pulsing={{ isEnabled: true }}
    />

    <ShapeSource id='scotters' shape={featureCollection(points)} >
      <SymbolLayer
        id="scooter-icons"
        minZoomLevel={1}
        style={{
          iconImage: 'pin',
          iconSize: 0.4,
          iconAllowOverlap: true,
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  </MapView>;
}