"use client";

import { apolloClient } from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}