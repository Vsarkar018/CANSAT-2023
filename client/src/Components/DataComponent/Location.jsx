import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
// import BlinkingDot from "../BlinkingDot";
// import CustomMarker from "../../asset";
import CustomMarker from "../../assets/pngtree-bright-orange-circle-clipart-png-image_2382099.PNG";
const delhiCoordinates = [
  { lat: 28.6139, lng: 77.209 }, // Delhi, India
  { lat: 28.6515, lng: 77.2306 }, // Connaught Place
  { lat: 28.7041, lng: 77.1025 }, // New Delhi Railway Station
  { lat: 28.5395, lng: 77.391 }, // Indira Gandhi International Airport
  // Add more coordinates as needed
];

const Location = () => {
  const [locations, setLocations] = useState({ lat: 28.6139, lng: 77.209 });

  useEffect(() => {
    let index = 0;
    const updateInterval = setInterval(() => {
      setLocations({
        lat: delhiCoordinates[index].lat,
        lng: delhiCoordinates[index].lng,
      });
      index = (index + 1) % delhiCoordinates.length;
    }, 2000); // Update every 1 second

    return () => clearInterval(updateInterval);
  }, []);
  console.log(locations.lat, locations.lng);
  console.log(CustomMarker);
  if (window.google && window.google.maps) {
    console.log(window.google.maps.Size);
  } else {
    console.log("Google Maps API not loaded or unavailable.");
  }

  return (
    <div style={{ height: "100%", width: "100%  " }}>
      <LoadScript googleMapsApiKey = "">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={{ lat: locations.lat, lng: locations.lng }} // Initial center
          zoom={15} // Initial zoom level
        >
          <MarkerF
            position={{ lat: locations.lat, lng: locations.lng }}
            icon={{
              url: CustomMarker, // Use the custom marker image
              scaledSize: window.google.maps.Size(50, 50), // Adjust the size as needed
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Location;
