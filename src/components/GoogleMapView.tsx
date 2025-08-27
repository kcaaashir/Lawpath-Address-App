"use client";
import React from "react";

/**
 * Props for GoogleMapView component
 */
type Props = {
  /** Latitude of the location */
  lat?: number | null;
  /** Longitude of the location */
  lng?: number | null;
  /** Height of the map in pixels (default: 320) */
  height?: number;
  /** Zoom level of the map (default: 14) */
  zoom?: number;
  /** Optional label for the map iframe */
  label?: string;
};

/**
 * GoogleMapView component renders a Google Maps iframe for a given latitude and longitude.
 *
 * Features:
 * - Displays a placeholder if latitude or longitude is not provided.
 * - Embeds Google Maps using an iframe with given coordinates and zoom.
 * - Responsive width with customizable height.
 *
 * @component
 * @param {Props} props - Component props
 * @returns {JSX.Element} The map iframe or placeholder
 *
 * @example
 * <GoogleMapView lat={-33.865143} lng={151.209900} zoom={12} label="Sydney" />
 */
export default function GoogleMapView({
  lat,
  lng,
  height = 320,
  zoom = 14,
  label,
}: Props) {
  if (!lat || !lng) {
    return (
      <div className="rounded-xl border p-4 bg-white">
        <p className="text-gray-500">No location selected.</p>
      </div>
    );
  }

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div
      className="rounded-xl overflow-hidden shadow"
      style={{ width: "100%", height }}
    >
      <iframe
        key={`${lat}-${lng}`}
        title={label || "Google Map"}
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
