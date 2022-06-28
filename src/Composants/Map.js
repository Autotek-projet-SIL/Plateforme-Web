import "./stylesheets/Map.css";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useState } from "react";
import Geocode from "react-geocode";

//centre de la carte : alger par defaut
const center = {
  lat: 36.77774845511901,
  lng: 3.061018064778832,
};

// Carte google maps
export default function Map(props) {
  const containerStyle = {
    minWidth: props.widthValue,
    minHeight: props.heightValue,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "Votre cle ici",
  });

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const handleClose = () => setShowingInfoWindow(false);
  const handleShow = () => setShowingInfoWindow(true);
  
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const infoPopup = (marker) => {
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };
  function createMarkers() {
    return props.markers.map((marker, index) => {
      return (
        <Marker
          key={marker.id}
          onClick={() => {
            infoPopup(marker);
          }}
          position={{
            lat: marker.latitude,
            lng: marker.longitude,
          }}
        >
          {showingInfoWindow && activeMarker === marker && (
            <InfoWindow
              marker={activeMarker}
              onClose={handleClose}
              visible={showingInfoWindow}
              options={{ maxWidth: 500 }}
            >
              <div id="infoTrajetPopup">
                <h4>
                  <b>Disponibilité: </b>
                  {(marker.disponible && "Disponible") || "Non disponible"}
                </h4>
                <h4>
                  <b>Etat: </b>
                  {marker.etat}
                </h4>
                <h4>
                  <b>Batterie restante : </b>
                  {marker.batterie + "%"}
                </h4>
                <h4>
                  <b>Température: </b>
                  {marker.temperature + "°"}
                </h4>
                <h4>
                  <b>Kilométrage: </b>
                  {marker.kilometrage + "Km"}
                </h4>
                <h4>
                  <b>Vitesse: </b>
                  {marker.vitesse + "km/h"}
                </h4>
                <h4>
                  <a href={"/atc/vehicule/" + marker.id}>
                    Plus d'informations sur le véhicule
                  </a>
                </h4>
                {!marker.disponible && (
                  <h4>
                    <a href={"/atc/gestionlocations/" + marker.id_louer}>
                      Plus d'informations sur la location
                    </a>
                  </h4>
                )}
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    });
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
  ) : (
    <></>
  );
}

export async function getReverseGeocodingData(lat, lng, setAdresse) {
  Geocode.setApiKey("AIzaSyCYFQXP0t1dUWtl9V4xm73lt-l_nQQIkcw");
  //try catch
  await Geocode.fromLatLng(lat, lng).then(
    (response) => {
      const address = response.results[0].formatted_address;
      setAdresse(address);
    },
    (error) => {
      console.error(error);
      setAdresse("");
    }
  );
}
