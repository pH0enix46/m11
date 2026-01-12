"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
}

const Map: React.FC<MapProps> = ({
  center = [23.8103, 90.4125], // Dhaka, Bangladesh coordinates
  zoom = 13,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={isMobile ? 12 : zoom}
      scrollWheelZoom={false}
      dragging={!isMobile}
      touchZoom={true}
      doubleClickZoom={true}
      zoomControl={true}
      className="w-full h-full rounded-2xl md:rounded-3xl z-0"
      style={{ minHeight: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={icon}>
        <Popup>
          <div className="text-center p-2">
            <p className="font-bold text-sm">M-11 Footwear</p>
            <p className="text-xs text-gray-600">Dhaka, Bangladesh</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
