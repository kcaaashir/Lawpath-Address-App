/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const ELASTIC_API_KEY = process.env.ELASTIC_KEY;
const indexName = process.env.ELASTIC_KEY_INDEX;
const ELASTIC_URL = process.env.ELASTIC_SEARCH_URL;

/**
 * Ensures that the Elasticsearch index exists with the proper mapping.
 *
 * If the index does not exist, this function will create it with
 * the required field definitions for logging (ts, type, payload, result, text).
 *
 * @returns {Promise<void>} Resolves when index exists or has been created.
 * @throws {Error} If the Elasticsearch API call fails.
 */
async function ensureIndex(): Promise<void> {
    const mapping = {
        mappings: {
            properties: {
                ts: { type: "date" },
                type: { type: "keyword" },
                input: { type: "object", enabled: true },
                result: { type: "object", enabled: true },
                text: { type: "semantic_text" },
            },
        },
    };

    await fetch(`${ELASTIC_URL}/${indexName}`, {
        method: "PUT",
        headers: {
            Authorization: `ApiKey ${ELASTIC_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mapping),
    });
}

/**
 * GET handler for logs.
 *
 * Fetches the most recent logs from Elasticsearch, sorted by timestamp.
 *
 * @returns {Promise<NextResponse>} JSON response containing:
 * - `items`: Array of log objects with their Elasticsearch `_id` and `_source`.
 * - On error: `{ items: [], error: string }` with HTTP 500 status.
 */
export async function GET(): Promise<NextResponse> {
    try {
        await ensureIndex();

        const res = await fetch(`${ELASTIC_URL}/${indexName}/_search`, {
            method: "POST", // Elasticsearch requires POST for search queries
            headers: {
                Authorization: `ApiKey ${ELASTIC_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sort: [{ ts: { order: "desc" } }],
                size: 20, // fetch last 20 logs
            }),
        });

        const data = await res.json();
        const items =
            data.hits?.hits?.map((h: any) => ({ id: h._id, ...h._source })) || [];

        return NextResponse.json({ items });
    } catch (err: any) {
        console.error("Error fetching logs:", err);
        return NextResponse.json(
            { items: [], error: err.message },
            { status: 500 }
        );
    }
}

/**
 * POST handler for logs.
 *
 * Stores a new log document in Elasticsearch. Automatically adds a timestamp (`ts`).
 *
 * @param {NextRequest} req - Incoming request with JSON body containing log data.
 *   Expected fields:
 *   - `type`: String identifier of log type.
 *   - `payload`: Input data (any JSON object).
 *   - `result`: Output/result data (any JSON object).
 *   - `text`: Optional string for semantic search.
 *
 * @returns {Promise<NextResponse>} JSON response with:
 * - `ok: true, resp: object` if log was stored successfully.
 * - On error: `{ ok: false, error: string }` with HTTP 500 status.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await ensureIndex();

        const body = await req.json();
        const doc = {
            ...body,
            ts: new Date().toISOString(), // add server-side timestamp
        };

        const res = await fetch(`${ELASTIC_URL}/${indexName}/_doc`, {
            method: "POST",
            headers: {
                Authorization: `ApiKey ${ELASTIC_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doc),
        });

        const data = await res.json();
        return NextResponse.json({ ok: true, resp: data });
    } catch (err: any) {
        console.error("Error storing log:", err);
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
