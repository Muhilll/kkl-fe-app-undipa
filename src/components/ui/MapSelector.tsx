/// <reference types="@types/google.maps" />
import { Component, createEffect, onMount } from "solid-js";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface MapSelectorProps {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
  disabled?: boolean;
  targetLatitude?: string;
  targetLongitude?: string;
  targetTitle?: string;
}

const MapSelector: Component<MapSelectorProps> = (props) => {
  let mapContainer!: HTMLDivElement;
  let searchInput!: HTMLInputElement;

  let map: google.maps.Map;
  let marker: google.maps.Marker;
  let targetMarker: google.maps.Marker | null = null;
  let searchBox: google.maps.places.SearchBox;

  // Default to Makassar if no initial value
  const defaultLat = -5.147665;
  const defaultLng = 119.432732;

  onMount(async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("VITE_GOOGLE_MAPS_API_KEY is not defined in .env");
      return;
    }

    setOptions({
      key: apiKey,
      v: "weekly",
      libraries: ["places"], // Load places library for the search box
    });

    try {
      await importLibrary("core");
      await importLibrary("maps");
      await importLibrary("places");
      await importLibrary("marker");

      const initialLat = props.latitude ? parseFloat(props.latitude) : defaultLat;
      const initialLng = props.longitude ? parseFloat(props.longitude) : defaultLng;

      map = new google.maps.Map(mapContainer, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
      });

      marker = new google.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map: map,
        draggable: !props.disabled,
        animation: google.maps.Animation.DROP,
      });

      if (props.targetLatitude && props.targetLongitude) {
        targetMarker = new google.maps.Marker({
          position: { lat: parseFloat(props.targetLatitude), lng: parseFloat(props.targetLongitude) },
          map: map,
          title: props.targetTitle || "Instansi Tujuan",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          animation: google.maps.Animation.DROP,
        });
      }

      // Handle marker drag
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          props.onChange(position.lat().toFixed(6), position.lng().toFixed(6));
        }
      });

      // Handle map click
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (props.disabled || !e.latLng) return;
        marker.setPosition(e.latLng);
        props.onChange(e.latLng.lat().toFixed(6), e.latLng.lng().toFixed(6));
      });

      // Setup SearchBox
      searchBox = new google.maps.places.SearchBox(searchInput);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener("bounds_changed", () => {
        const bounds = map.getBounds();
        if (bounds) {
          searchBox.setBounds(bounds);
        }
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (!places || places.length === 0) {
          return;
        }

        const place = places[0];

        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        // Update map center and marker
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
        }

        marker.setPosition(place.geometry.location);

        // Emit changes
        props.onChange(newLat.toFixed(6), newLng.toFixed(6));
      });

    } catch (e) {
      console.error("Failed to load Google Maps API", e);
    }
  });

  // Sync external prop changes to marker (if it wasn't triggered by internal dragging)
  createEffect(() => {
    const latProp = props.latitude;
    const lngProp = props.longitude;

    if (map && marker && latProp && lngProp) {
      const lat = parseFloat(latProp);
      const lng = parseFloat(lngProp);
      if (!isNaN(lat) && !isNaN(lng)) {
        const currentPos = marker.getPosition();
        if (currentPos) {
          if (Math.abs(currentPos.lat() - lat) > 0.000001 || Math.abs(currentPos.lng() - lng) > 0.000001) {
            const newPos = { lat, lng };
            marker.setPosition(newPos);
            map.setCenter(newPos);
          }
        }
      }
    }
  });

  // Sync external target prop changes to targetMarker
  createEffect(() => {
    const tLat = props.targetLatitude;
    const tLng = props.targetLongitude;
    const tTitle = props.targetTitle;

    if (map && tLat && tLng) {
      const lat = parseFloat(tLat);
      const lng = parseFloat(tLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (!targetMarker) {
          targetMarker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: tTitle || "Instansi Tujuan",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          });
        } else {
          targetMarker.setPosition({ lat, lng });
          targetMarker.setTitle(tTitle || "Instansi Tujuan");
        }
      }
    } else if (targetMarker) {
      targetMarker.setMap(null);
      targetMarker = null;
    }
  });

  // Toggle draggable
  createEffect(() => {
    if (marker) {
      marker.setDraggable(!props.disabled);
    }
  });

  return (
    <div style={{ "margin-top": "16px", "grid-column": "1 / -1" }}>
      <label style={{ "margin-bottom": "8px", display: "block", "font-size": "11px", "font-weight": "700", "color": "var(--gray-500)", "text-transform": "uppercase", "letter-spacing": "0.07em" }}>
        Pilih Lokasi pada Peta (Google Maps)
      </label>

      <div style={{ "margin-bottom": "8px" }}>
        <input
          ref={searchInput}
          type="text"
          placeholder="Cari nama jalan, gedung, atau instansi..."
          disabled={props.disabled}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--gray-300)", "border-radius": "var(--radius-sm)", "font-size": "14px", "font-family": "inherit" }}
        />
      </div>

      <div
        ref={mapContainer}
        style={{
          height: "300px",
          width: "100%",
          "border-radius": "var(--radius-sm)",
          border: "1px solid var(--gray-300)",
          "z-index": "1"
        }}
      />
      <small style={{ color: "var(--gray-500)", "margin-top": "6px", display: "block" }}>
        Klik pada peta, geser marker, atau gunakan fitur pencarian terintegrasi dari Google Places untuk menentukan koordinat secara akurat.
      </small>
    </div>
  );
};

export default MapSelector;
