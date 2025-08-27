import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import VerifierTab from "@/components/VerifierTab";
import { useAppStore } from "@/lib/zustandStore";
import { useLazyQuery } from "@apollo/client/react";

// Mock Zustand store
jest.mock("@/lib/zustandStore", () => ({
  useAppStore: jest.fn(),
}));

// Mock Apollo useLazyQuery
jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
}));

// Mock GoogleMapView
jest.mock("@/components/GoogleMapView", () => () => (
  <div data-testid="mock-map">Map</div>
));

describe("VerifierTab", () => {
  const mockStore = {
    vPostcode: "",
    vSuburb: "",
    vState: "",
    vResult: null,
    setVPostcode: jest.fn(),
    setVSuburb: jest.fn(),
    setVState: jest.fn(),
    setVResult: jest.fn(),
  };

  const mockRunValidate = jest.fn();

  beforeEach(() => {
    (useAppStore as jest.Mock).mockReturnValue(mockStore);
    (useLazyQuery as jest.Mock).mockReturnValue([mockRunValidate, {}]);
    jest.clearAllMocks();
  });

  it("renders inputs and button", () => {
    render(<VerifierTab />);

    expect(screen.getByPlaceholderText("Postcode")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Suburb")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("State")).toBeInTheDocument();
    expect(screen.getByText("Validate")).toBeInTheDocument();
  });

  it("updates Zustand state on input change", () => {
    render(<VerifierTab />);

    fireEvent.change(screen.getByPlaceholderText("Postcode"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Suburb"), {
      target: { value: "Sydney" },
    });
    fireEvent.change(screen.getByPlaceholderText("State"), {
      target: { value: "NSW" },
    });

    expect(mockStore.setVPostcode).toHaveBeenCalledWith("1234");
    expect(mockStore.setVSuburb).toHaveBeenCalledWith("Sydney");
    expect(mockStore.setVState).toHaveBeenCalledWith("NSW");
  });

  it("calls runValidate when all fields are filled and Validate is clicked", () => {
    mockStore.vPostcode = "2000";
    mockStore.vSuburb = "Sydney";
    mockStore.vState = "NSW";

    render(<VerifierTab />);

    fireEvent.click(screen.getByText("Validate"));

    expect(mockRunValidate).toHaveBeenCalledWith({
      variables: { postcode: "2000", suburb: "Sydney", state: "NSW" },
    });
  });

  it("sets error result if fields are missing", () => {
    mockStore.vPostcode = "";
    mockStore.vSuburb = "";
    mockStore.vState = "";

    render(<VerifierTab />);

    fireEvent.click(screen.getByText("Validate"));

    expect(mockStore.setVResult).toHaveBeenCalledWith({
      valid: false,
      error: "Please enter all the above fields.",
      match: null,
    });
  });

});
