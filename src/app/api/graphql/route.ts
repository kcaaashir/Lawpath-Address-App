/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/lib/graphqlQuery";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

/**
 * ------------------ Resolvers ------------------
 *
 * Provides the logic behind GraphQL queries.
 */
const resolvers = {
  Query: {
    /**
     * Validate a postcode and state against the Australia Post API.
     *
     * @param _ - Unused root argument.
     * @param args - Query arguments.
     * @param args.postcode - The postcode to validate.
     * @param args.suburb - The suburb to validate against the postcode.
     * @param args.state - The state to filter localities.
     *
     * @returns {Promise<Array>} List of matching localities or an empty array if no matches are found.
     */
    validate: async (
      _: any,
      args: { postcode: string; suburb: string; state: string }
    ) => {
      const { postcode, state } = args;

      try {
        // API endpoint from environment variables
        const url = `${process.env.AUSTRALIA_POST_API}/staging/postcode/search.json?q=${postcode}&state=${state}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.AUSTRALIA_POST_AUTH_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return [];

        const data = await res.json();
        let loc = data.localities?.locality ?? null;

        // Ensure locality is always treated as an array
        if (loc && !Array.isArray(loc)) loc = [loc];

        if (Array.isArray(loc)) {
          return loc.map((l: any) => ({
            id: Number(l.id) || 0,
            category: l.category || "",
            latitude: Number(l.latitude || 0),
            longitude: Number(l.longitude || 0),
            location: l.location || "",
            postcode: l.postcode || "",
            state: l.state || "",
          }));
        }

        return [];
      } catch (err: any) {
        console.error("API error:", err);
        return [];
      }
    },
  },
};

/**
 * ------------------ Apollo Server ------------------
 *
 * Creates an Apollo GraphQL server integrated with Next.js.
 */
const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server);

/**
 * Next.js API Route Handler (GET).
 *
 * Handles incoming GraphQL GET requests.
 *
 * @param request - The incoming HTTP request object.
 * @returns {Promise<Response>} A response handled by Apollo Server.
 */
export async function GET(request: Request) {
  return handler(request as any);
}

/**
 * Next.js API Route Handler (POST).
 *
 * Handles incoming GraphQL POST requests.
 *
 * @param request - The incoming HTTP request object.
 * @returns {Promise<Response>} A response handled by Apollo Server.
 */
export async function POST(request: Request) {
  return handler(request as any);
}
