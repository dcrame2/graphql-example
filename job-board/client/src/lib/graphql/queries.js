import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  },
});

const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
  cache: new InMemoryCache(),
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { job } = await client.request(mutation, {
    input: { title, description },
  });

  return job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  const { company } = await client.request(query, { id });
  return company;
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        date
        description
        company {
          id
          name
        }
      }
    }
  `;

  const { job } = await client.request(query, { id });

  return job;
}

export async function getJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const result = await apolloClient.query({
    query,
  });
  return result.data.jobs;
}
