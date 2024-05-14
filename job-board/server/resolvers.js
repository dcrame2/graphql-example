import { getJob, getJobs, getJobsByCompany, createJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError(`Company not found: ${id}`);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);

      if (!job) {
        throw notFoundError(`Job not found: ${id}`);
      }
      return job;
    },
    jobs: async () => getJobs(),
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // TODO set based on user
      return createJob({ companyId, title, description });
    },
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
