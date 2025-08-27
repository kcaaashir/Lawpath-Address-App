"use client";

import { useEffect, useState } from "react";

/**
 * Type definition for a single Elasticsearch log item.
 */
type LogItem = {
  /** Unique identifier of the log */
  id?: string;
  /** Timestamp of the log in ISO string format */
  ts?: string;
  /** Type of log: either "verifier" or "source" */
  type?: "verifier" | "source";
  /** Input payload stored in the log */
  payload?: unknown;
  /** Result stored in the log */
  result?: unknown;
};

/**
 * ElasticLogs component fetches and displays logs stored in Elasticsearch.
 * 
 * Features:
 * - Fetches logs from `/api/logs` endpoint
 * - Displays a refresh button
 * - Shows a loading indicator while fetching
 * - Displays logs in a styled list with timestamp and type
 * - Uses TailwindCSS for styling
 * 
 * @component
 * @example
 * return (
 *   <ElasticLogs />
 * )
 */
export default function ElasticLogs() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the logs from the API and updates the component state.
   */
  async function load() {
    setLoading(true);
    const res = await fetch("/api/logs");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  // Load logs on component mount
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Elasticsearch Logs</h2>
          <button className="btn" onClick={load}>Refresh</button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !items.length ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="p-3 border rounded-xl bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-0.5 bg-sky-300 rounded-full border">
                    {it.type}
                  </span>
                  <span>{new Date(it.ts ?? Date.now()).toLocaleString()}</span>
                </div>
                <pre className="mt-2 text-xs overflow-auto bg-gray-50 p-2 rounded">
                  {JSON.stringify(it, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
