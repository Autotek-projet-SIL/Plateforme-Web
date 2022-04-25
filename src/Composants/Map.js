import "./stylesheets/Map.css";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const containerStyle = {
    minWidth: '80vw',
    minHeight: '80vh',
  };
  
  const center = {
      //centre de la carte : alger
    lat: 36.77774845511901,
    lng: 3.061018064778832
  };

export default function Map (props)
{
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCYFQXP0t1dUWtl9V4xm73lt-l_nQQIkcw"
      })
    
      const [map, setMap] = useState(null)
    
      const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
      }, [])
    
      const onUnmount = useCallback(function callback(map) {
        setMap(null)
      }, [])
      function createMarkers ()
      {
        return props.markers.map((marker,index) => {
          
          return(<Marker key={marker.id}
            position={{
              lat: marker.latitude,
              lng: marker.longitude
          }}
          >
            </Marker>)
        })
      }
      return isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: Number(center.lat), lng: Number(center.lng) }}
            initialCenter={{ lat: Number(center.lat), lng: Number(center.lng) }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {createMarkers()}
          </GoogleMap>
      ) : <></>
}