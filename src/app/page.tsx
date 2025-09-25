"use client";

import { useState } from "react";
import { useAdvocates } from "@/hooks/useAdvocates";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: advocates, loading, error, pagination, updateFilters } = useAdvocates({
    page: 1,
    limit: 10,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ search: value });
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    updateFilters({ search: "" });
  };

  if (loading) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleResetSearch}>Reset Search</button>
      </div>
      <br />
      <br />
      {pagination && (
        <div>
          <p>
            Showing {advocates.length} of {pagination.total} advocates
            (Page {pagination.page} of {pagination.totalPages})
          </p>
        </div>
      )}
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => (
            <tr key={advocate.id}>
              <td>{advocate.firstName}</td>
              <td>{advocate.lastName}</td>
              <td>{advocate.city}</td>
              <td>{advocate.degree}</td>
              <td>
                {advocate.specialties.map((specialty, index) => (
                  <div key={index}>{specialty}</div>
                ))}
              </td>
              <td>{advocate.yearsOfExperience}</td>
              <td>{advocate.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
