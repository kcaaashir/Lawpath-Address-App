// src/_tests_/components/SourceTab.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import SourceTab from "@/components/SourceTab";
import { useAppStore } from "@/lib/zustandStore";

// --- Mock zustand ---
jest.mock("@/lib/zustandStore", () => ({
  useAppStore: jest.fn(),
}));

// --- Mock Apollo ---
jest.mock("@apollo/client/react", () => ({
  gql: (literals: any) => literals,
  useLazyQuery: jest.fn(),
}));
import { useLazyQuery } from "@apollo/client/react";

// --- Mock Swiper ---
jest.mock("swiper/react", () => {
  return {
    Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
    SwiperSlide: ({ children }: any) => <div data-testid="slide">{children}</div>,
  };
});

const sourceResultsMock = [
  {
    id: "1",
    location: "Melbourne",
    postcode: "3000",
    state: "VIC",
    category: "Hospital",
    latitude: -37.8136,
    longitude: 144.9631,
  },
];

describe("SourceTab component", () => {
  const setSourceQueryMock = jest.fn();
  const setSourceResultsMock = jest.fn();
  const setSelectedLocationMock = jest.fn();

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ ok: true }),
      })
    ) as jest.Mock;
  });

  beforeEach(() => {
    (useAppStore as jest.Mock).mockReturnValue({
      sourceQuery: "Melbourne",
      sourceState: "VIC",
      sourceResults: sourceResultsMock,
      selectedLocation: null,
      setSourceQuery: setSourceQueryMock,
      setSourceResults: setSourceResultsMock,
      setSelectedLocation: setSelectedLocationMock,
    });

    (useLazyQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: { validate: sourceResultsMock }, loading: false, error: null },
    ]);
  });

  it("renders search input and button", () => {
    render(<SourceTab />);
    expect(screen.getByPlaceholderText(/Suburb or Postcode/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });

  it("renders locations list", async () => {
    render(<SourceTab />);
    expect(await screen.findByText(/Melbourne/i)).toBeInTheDocument();
  });

  it("selects a location when clicked", async () => {
    render(<SourceTab />);
    const locDiv = await screen.findByText(/Melbourne/i);
    fireEvent.click(locDiv);
    expect(setSelectedLocationMock).toHaveBeenCalledWith(sourceResultsMock[0]);
    expect(global.fetch).toHaveBeenCalled();
  });
});
