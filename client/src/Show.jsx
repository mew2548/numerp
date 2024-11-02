import axios from "axios";
import React from "react";
import { useState, useCallback, useEffect } from "react";

function Show() {
  const [roots, setRoots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const pullRoots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/load/rootequation/all/100`
      );
      const data = response.data;
      if (data.status === "pass") {
        setRoots(data.equations);
      } else {
        throw new Error("Failed to fetch equations");
      }
    } catch (er) {
      setError(er.message || "An error occurred while fetching the data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    pullRoots();
  }, []);
  return (
    <div className="flex flex-col items-center mt-20">
      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Root Equations"
        />
        <div role="tabpanel" className="tab-content p-10">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <tbody>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Equation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roots.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.equation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Show;
