// __mocks__/GoogleMapView.tsx
import React from "react";

const GoogleMapView = ({ lat, lng, height, zoom }: any) => {
  return <div data-testid="google-map">Map at {lat}, {lng}</div>;
};

export default GoogleMapView;