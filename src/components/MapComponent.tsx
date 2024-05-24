import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { DataItem } from "../lib/types";
import { getIcon } from "../lib/icons";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  data: DataItem[];
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  const map = useRef<L.Map | null>(null);
  const markerLayer = useRef(L.layerGroup());

  useEffect(() => {
    if (!map.current) {
      // Initialize map
      map.current = L.map("mapId").setView([50.062, 19.906], 12);

      // Add a tile layer (using OpenStreetMap here)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map.current);
    }
  }, []);

  useEffect(() => {
    if (map.current) {
      // Clear the marker layer
      markerLayer.current.clearLayers();

      // Adding a marker for each data point
      data.forEach((item) => {
        const icon = getIcon(item.Type, item.BatteryLevel * item.Strength);
        const marker = L.marker([item.Position.Lat, item.Position.Lon], {
          icon: icon,
        }).bindPopup(`Id: ${item.Id}, Name: ${item.Name}, Type: ${item.Type}`);
        markerLayer.current.addLayer(marker);
      });

      // Add the marker layer to the map
      map.current.addLayer(markerLayer.current);
    }
  }, [data]);

  return (
    <div
      id="mapId"
      className="h-96 w-full md:w-3/4 lg:w-1/2 mx-auto border-2 border-gray-300 dark:border-gray-700"
    ></div>
  );
};

export default MapComponent;
