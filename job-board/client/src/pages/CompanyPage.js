import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries";
import { useState, useEffect } from "react";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        console.error("Error loading company:", JSON.stringify(error));
        setState({ company: null, loading: false, error: true });
      }
    })();
  }, [companyId]);

  console.log("[companypage] company", state);

  const { company, loading, error } = state;

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className="has-text-danger">Data unavailable</p>;
  }

  // const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
