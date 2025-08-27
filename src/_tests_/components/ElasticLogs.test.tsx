import { render, screen, fireEvent } from "@testing-library/react";
import ElasticLogs from "@/components/ElasticLogs";

const mockLogs = [
  {
    id: "1",
    ts: "2025-08-26T12:00:00Z",
    type: "verifier",
    payload: { postcode: "3000" },
    result: { valid: true },
  },
  {
    id: "2",
    ts: "2025-08-26T12:05:00Z",
    type: "source",
    payload: { query: "Melbourne" },
    result: { latitude: -37.8136, longitude: 144.9631 },
  },
];

beforeEach(() => {
  // Mock global fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ items: mockLogs }),
    } as any)
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("ElasticLogs component", () => {
  it("renders loading initially", () => {
    render(<ElasticLogs />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders logs after fetch", async () => {
    render(<ElasticLogs />);

    // Wait for header and log items to appear asynchronously
    expect(await screen.findByText(/Elasticsearch Logs/i)).toBeInTheDocument();

    // "verifier" appears twice (badge + pre), so use findAllByText
    const verifierItems = await screen.findAllByText(/verifier/i);
    expect(verifierItems.length).toBeGreaterThan(0);

    const sourceItems = await screen.findAllByText(/source/i);
    expect(sourceItems.length).toBeGreaterThan(0);

    expect(await screen.findByText(/3000/i)).toBeInTheDocument();
    expect(await screen.findByText(/Melbourne/i)).toBeInTheDocument();
  });

  it("renders 'No logs yet' when API returns empty array", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ items: [] }),
    } as any);

    render(<ElasticLogs />);

    expect(await screen.findByText(/No logs yet/i)).toBeInTheDocument();
  });

  it("refresh button fetches logs again", async () => {
    render(<ElasticLogs />);

    await screen.findByText(/Elasticsearch Logs/i);

    fireEvent.click(screen.getByText(/Refresh/i));

    // Fetch should be called twice now: initial mount + refresh
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
