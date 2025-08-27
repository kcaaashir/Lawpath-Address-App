"use client";

import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { GET_SOURCES } from "@/lib/graphqlQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLazyQuery } from "@apollo/client/react";
import GoogleMapView from "@/components/GoogleMapView";
import { useAppStore, Locality } from "@/lib/zustandStore";

export default function SourceTab() {
  const {
    sourceQuery,
    sourceState,
    sourceResults,
    selectedLocation,
    setSourceQuery,
    setSourceResults,
    setSelectedLocation,
  } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [runQuery, { data, loading, error }] = useLazyQuery<{ validate: Locality[] }>(
    GET_SOURCES,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    if (data?.validate) {
      setSourceResults(data.validate);

      if (data.validate.length > 0) {
        const firstLoc = data.validate[0];
        setSelectedLocation(firstLoc);

        // Log only selected location to Elasticsearch
        fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "source",
            input: { query: sourceQuery, state: sourceState },
            result: firstLoc,
          }),
        });
      } else {
        setSelectedLocation(null);
      }
    }
  }, [data, setSourceResults, setSelectedLocation, sourceQuery, sourceState]);

  const handleSearch = () => {
    runQuery({ variables: { query: sourceQuery, state: sourceState } });
  };

  const filteredResults = sourceResults?.filter((loc) =>
    categoryFilter ? loc.category === categoryFilter : true
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Source Locations</h2>

      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded-lg"
          placeholder="Suburb or Postcode"
          value={sourceQuery}
          onChange={(e) => setSourceQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {sourceResults
            ?.map((loc) => loc.category)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="text-red-600">❌ {error.message}</div>}

      {/* Locations List with Swiper */}
      <h2 className="text-lg font-semibold">Locations List</h2>
      {filteredResults && filteredResults.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {filteredResults.map((loc) => (
            <SwiperSlide key={loc.id}>
              <div
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-100
                ${selectedLocation?.id === loc.id ? "bg-blue-100 border-blue-400" : "bg-gray-50"}`}
                onClick={() => {
                  setSelectedLocation(loc);

                  // Log selected location
                  fetch("/api/logs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "source",
                      input: { query: sourceQuery, state: sourceState },
                      result: loc,
                    }),
                  });
                }}
              >
                <div className="font-medium">{loc.location}</div>
                <div className="text-sm text-gray-600">
                  {loc.postcode}, {loc.state}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="p-4 border rounded-lg bg-gray-50 text-gray-600">
          ❌ No matches found for {sourceQuery}.
        </div>
      )}

      {/* Map View */}
      {selectedLocation?.latitude && selectedLocation?.longitude && (
        <div>
          <h2 className="text-lg font-semibold">Map View</h2>
          <GoogleMapView
            lat={selectedLocation.latitude}
            lng={selectedLocation.longitude}
            height={400}
            zoom={14}
          />
        </div>
      )}
    </div>
  );
}
