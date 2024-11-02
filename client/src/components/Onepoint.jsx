import axios from "axios";
import React from "react";
import { useState, useCallback, useEffect } from "react";
import { evaluate } from "mathjs";
import Plot from "react-plotly.js";

function Onepoint() {
  const [formData, setFormData] = useState({
    equation: "",
    xInitial: "",
    tolerance: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [plotData, setPlotdata] = useState(null);

  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);
  const validateInput = useCallback(() => {
    const { equation, xInitial, tolerance } = formData; //destructure
    const xIntNum = parseFloat(xInitial);
    const toleranceNum = parseFloat(tolerance);

    if (equation === "" || xInitial === "" || tolerance === "")
      return "Please fill in all fields.";

    if (isNaN(xIntNum) || isNaN(toleranceNum))
      return "X initial and tolerance must be number";

    if (toleranceNum <= 0) return "error must be grather than 0";

    try {
      evaluate(equation, { x: 1 });
    } catch (er) {
      return "Invalid equation.";
    }
    return null;
  }, [formData]);
  const calOnepoint = useCallback(() => {
    const {
      equation,
      xInitial: xIntString,
      tolerance: toleranceString,
    } = formData;
    let xIntNum = parseFloat(xIntString);
    let tolerance = parseFloat(toleranceString);
    const checkError = (xOld, xNew) => Math.abs((xNew - xOld) / xNew);
    const f = (xinput) => evaluate(equation, { x: xinput });

    const data = [];
    const iterations = [];
    const errors = [];
    let ea = 1;
    let iter = 1;
    let xN = xIntNum;
    let xO = xIntNum;
    const MAX_ITERATION = 50;

    do {
      xN = f(xO);
      ea = checkError(xO, xN);

      data.push({ iteration: iter, Xi: xN, error: ea });
      iterations.push(iter);
      errors.push(ea);

      xO = xN;
      iter++;
    } while (iter <= MAX_ITERATION && ea > tolerance);

    setPlotdata({ iterations, errors });
    return {
      root: xN,
      data: data,
      xInitial: xIntNum,
      iteration: data.length,
      X: xN,
      error: ea,
    };
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const validationError = validateInput();
      if (validationError) {
        setError(validationError);
        setResult(null);
        setPlotdata(null);
      } else {
        setError("");
        const newResult = calOnepoint();
        setResult(newResult);
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/save/rootequation/all`,
            {
              equation: formData.equation,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log("saved");
          })
          .catch((err) => {
            if (err.response) {
              console.log(`${err.response.data.message}`);
            } else if (err.request) {
              console.log("Server Down");
            } else {
              console.log("Error:", err.message);
            }
          });
      }
    },
    [validateInput, calOnepoint]
  );
  useEffect(() => {
    setResult(null);
    setPlotdata(null);
  }, [formData]);

  return (
    <>
      <div className="bg-[#fff3db] flex justify-center items-center rounded-3xl max-w-4xl m-auto mt-16">
        <div className="flex flex-col justify-center w-4/5">
          <h2 className="text-[#54321d] text-5xl font-semibold mt-6 text-center">
            One-Point
          </h2>

          <div className="mt-3 w-full bg-[#fff3db] ">
            <form
              className="flex justify-center items-center flex-col"
              onSubmit={handleSubmit}
            >
              <div className="w-96 my-5">
                <label className="form-control w-full justify-start">
                  <div className="label">
                    <span className="label-text">f(x)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="98x-5"
                    className="input input-bordered w-full  "
                    id="equation"
                    onChange={handleInputChange}
                  />
                </label>
                <div className="flex justify-between">
                  <label className="form-control ">
                    <div className="label">
                      <span className="label-text">Initial</span>
                    </div>
                    <input
                      type="text"
                      placeholder="0.1"
                      className="input input-bordered w-32 justify-between"
                      id="xInitial"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <label className="form-control justify-center">
                  <div className="label ">
                    <span className="label-text">Tolerance(Error)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="0.000001"
                    className="input input-bordered w-full"
                    id="tolerance"
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              {error && <p className="text-pink-500">{error}</p>}

              <button
                className="btn btn-active bg-[#ff7ed0] text-white m-6"
                type="submit"
              >
                Calculate
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* graph */}
      {plotData && (
        <div className="my-8 w-full flex justify-center ">
          <Plot
            data={[
              {
                x: plotData.iterations,
                y: plotData.errors,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#ffa5cc" },
                name: "Error",
              },
            ]}
            layout={{
              width: 1000,
              height: 500,
              title: "Error vs Iteration",
              xaxis: { title: "Iteration" },
              yaxis: { title: "Error", type: "log" },
            }}
          ></Plot>
        </div>
      )}

      {/* table */}
      {result && (
        <div className="my-8 w-4/5 mx-auto">
          <div className="overflow-x-auto">
            <div className="flex justify-around w-full">
              <h4 className="text-center my-6 text-xl font-semibold">
                Root found : {result.root.toFixed(6)}
              </h4>
              <h4 className="text-center my-6 text-xl font-semibold">
                Iterations : {result.iteration}
              </h4>
              <h4 className="text-center my-6 text-xl font-semibold">
                Error : {result.error.toFixed(6)}
              </h4>
            </div>
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Iteration</th>
                  <th>Initial</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.Xi.toFixed(6)}</td>
                    <td>{row.error.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
export default Onepoint;
