import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { featureCollection, point } from '@turf/helpers';
import { pin } from "~/assets";
import scooters from '~/data/scooter.json';
import { useScooter } from "~/providers/ScooterProvider";

export default function ScooterMarkers() {
  const {
    setSelectedScooter,
  } = useScooter();

  const points = scooters.map(scooter => point(
    [scooter.long, scooter.lat],
    { scooter }
  ));

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter) {
      setSelectedScooter(event.features[0].properties?.scooter);
    }
  };

  return (
    <ShapeSource
      id='scotters'
      cluster
      shape={featureCollection(points)}
      onPress={onPointPress}
    >
      <SymbolLayer
        id='clusters-count'
        style={{
          textField: ['get', 'point_count'],
          textSize: 16,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="cluster"
        belowLayerID='clusters-count'
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleOpacity: 0.7,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        minZoomLevel={1}
        style={{
          iconImage: 'pin',
          iconSize: 0.4,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}