"use client";

import { useEffect, useState } from "react";
import { VALIDATE } from "@/lib/graphqlQuery"
import { useLazyQuery } from "@apollo/client/react";
import GoogleMapView from "@/components/GoogleMapView";
import { useAppStore, ValidationResult, Locality } from "@/lib/zustandStore";

// ------------------ Component ------------------
export default function VerifierTab() {
  const {
    vPostcode,
    vSuburb,
    vState,
    vResult,
    setVPostcode,
    setVSuburb,
    setVState,
    setVResult,
  } = useAppStore();

  const [showResult, setShowResult] = useState(true);
  const [showError, setShowError] = useState(true);

  const [runValidate, { data, loading, error }] = useLazyQuery<{ validate: Locality[] }>(
    VALIDATE,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    if (data?.validate.length) {
      const match = data.validate.find(
        (loc) => loc.location.toLowerCase() === vSuburb.toLowerCase()
      );
      const result: ValidationResult = match
        ? { valid: true, error: null, match }
        : { valid: false, error: `The suburb ${vSuburb} doesn't exist in state ${vState}`, match: null };

      setVResult(result);
      setShowResult(true);

      // optional logging
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "verifier",
          input: { postcode: vPostcode, suburb: vSuburb, state: vState },
          result,
        }),
      });
    } else if (data) {
      const result: ValidationResult = {
        valid: false,
        error: `The postcode ${vPostcode} does not match the suburb ${vSuburb}`,
        match: null,
      };
      setVResult(result);
      setShowResult(true);
    }
  }, [data, vPostcode, vSuburb, vState, setVResult]);

  const handleValidate = () => {
    if(!vPostcode || !vSuburb || !vState) {
      const result: ValidationResult = {
        valid: false,
        error: `Please enter all the above fields.`,
        match: null,
      };
      setVResult(result);
      return;
    }
    runValidate({ variables: { postcode: vPostcode, suburb: vSuburb, state: vState } });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Verifier</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded-lg"
          placeholder="Postcode"
          value={vPostcode}
          onChange={(e) => setVPostcode(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Suburb"
          value={vSuburb}
          onChange={(e) => setVSuburb(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="State"
          value={vState}
          onChange={(e) => setVState(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          onClick={handleValidate}
          disabled={loading}
        >
          {loading ? "Validating..." : "Validate"}
        </button>
      </div>

      {/* API error div with close button */}
      {error && showError && (
        <div className="relative p-4 border rounded-lg bg-red-50 mt-4">
          <button
            onClick={() => setShowError(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
            aria-label="Close"
          >
            ×
          </button>
          <div className="text-red-600">❌ {error.message}</div>
        </div>
      )}

      {/* Validation result div with close button */}
      {vResult && showResult && (
        <div className="relative p-4 border rounded-lg bg-gray-50 mt-4">
          <button
            onClick={() => setShowResult(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
            aria-label="Close"
          >
            ×
          </button>
          {vResult.valid ? (
            <div className="text-green-500 font-medium">
              ✅ The postcode, suburb, and state input are valid.
            </div>
          ) : (
            <div className="text-red-600 font-medium">❌ {vResult.error || "Unknown error"}</div>
          )}
        </div>
      )}

      {/* Map view */}
      {vResult?.valid && vResult.match?.latitude && vResult.match?.longitude && (
        <div>
          <h3 className="text-lg font-semibold">Map View</h3>
          <GoogleMapView
            lat={vResult.match.latitude}
            lng={vResult.match.longitude}
            height={400}
            zoom={14}
          />
        </div>
      )}
    </div>
  );
}
