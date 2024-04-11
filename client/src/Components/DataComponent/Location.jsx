import React, { useState, useEffect } from "react";
import markerImage from "../../assets/team-logo.png"
import { useGlobalContext } from "../../context/appContext";

let map;
let marker;
let gnss_lon = 77.2295 , gnss_lat = 28.6129;
const Location = () => {


  const {telemetry } = useGlobalContext();
  // const { lat, lng } = coordinate || {};

  // const addPath = map => {
  //   const path = new google.maps.Polyline({
  //     path: pathCoordinates,
  //     geodesic: true,
  //     strokeColor: "red",
  //     strokeOpacity: 1.0,
  //     strokeWeight: 0,
  //     icons: [
  //       {
  //         icon: {
  //           path: "M 0,-1 0,1",
  //           strokeOpacity: 1,
  //           scale: 2,
  //         },
  //         offset: "0",
  //         repeat: "10px",
  //       },
  //     ],
  //   });

  //   path.setMap(map);
  // };
  const setSatellitePosition = map => {
    gnss_lon  = telemetry.split(',')[9];
    gnss_lat  = telemetry.split(',')[8];
    // console.log(gnss_lat,gnss_lon);
    marker?.setMap(null);
    marker = new google.maps.Marker({
      position: { lat: parseFloat(gnss_lat), lng: parseFloat(gnss_lon) },
      map,
      icon: {
        url: markerImage,
        scale: new google.maps.Size(0, 0),
        anchor: new google.maps.Point(20, 20),
      },
    });
    marker.setMap(map);

    google.maps.Marker;
  };

  useEffect(() => {
    setSatellitePosition(map);
  }, [telemetry]);

  useEffect(() => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 28.6129, lng: 77.2295 },
      zoom: 15,
    });

    // addPath(map);
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%  " }}></div>;
};

export default Location;
