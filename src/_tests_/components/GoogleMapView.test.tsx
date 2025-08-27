import { render, screen } from "@testing-library/react";
import GoogleMapView from "@/components/GoogleMapView";

describe("GoogleMapView", () => {
  it("renders 'No location selected' if no coordinates", () => {
    render(<GoogleMapView />);
    expect(screen.getByText("No location selected.")).toBeInTheDocument();
  });

  it("renders iframe when lat/lng are provided", () => {
    render(<GoogleMapView lat={1} lng={2} />);
    const iframe = screen.getByTitle("Google Map");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("1,2"));
  });
});
