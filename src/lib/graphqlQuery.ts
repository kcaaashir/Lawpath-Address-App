import { gql } from "@apollo/client";

export const GET_SOURCES = gql`
  query GetSources($query: String!, $state: String!) {
    validate(postcode: $query, suburb: $query, state: $state) {
      id
      category
      latitude
      longitude
      location
      postcode
      state
    }
  }
`;

export const VALIDATE = gql`
  query Validate($postcode: String!, $suburb: String!, $state: String!) {
    validate(postcode: $postcode, suburb: $suburb, state: $state) {
      id
      category
      latitude
      longitude
      location
      postcode
      state
    }
  }
`;

export const typeDefs = gql`
  type Locality {
    id: ID!
    category: String!
    latitude: Float!
    longitude: Float!
    location: String!
    postcode: String!
    state: String!
  }

  type Query {
    validate(postcode: String!, suburb: String!, state: String!): [Locality!]!
  }
`;