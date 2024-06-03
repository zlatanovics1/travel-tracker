import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import Message from "./Message";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    position: userPosition,
    isLoading: isLoadingPosition,
    error,
    getPosition,
  } = useGeoLocation();
  const [lat, lng] = useUrlPosition();
  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (userPosition) setMapPosition([userPosition.lat, userPosition.lng]);
    },
    [userPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {error ? (
        <Message message={error} />
      ) : (
        <>
          {" "}
          {!userPosition && (
            <Button type="position" onClick={getPosition}>
              {isLoadingPosition ? "Loading..." : "Use your position"}
            </Button>
          )}
          <MapContainer
            center={mapPosition}
            zoom={13}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {cities.map((city) => (
              <Marker
                position={[city.position.lat, city.position.lng]}
                key={city.id}
              >
                <Popup>
                  <span>{city.emoji}</span> <span>{city.country}</span>
                </Popup>
              </Marker>
            ))}
            <ChangeView position={mapPosition} />
            <DetectClick />
          </MapContainer>
        </>
      )}
    </div>
  );
}

function ChangeView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
