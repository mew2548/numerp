import axios from "axios";
import React from "react";
import { useState, useCallback, useEffect } from "react";
import { evaluate } from "mathjs";
import Plot from "react-plotly.js";

function Bisection() {
  // State
  const [formData, setFormData] = useState({
    equation: "",
    xl: "",
    xr: "",
    tolerance: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [plotData, setPlotdata] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const validateInput = useCallback(() => {
    const { equation, xl, xr, tolerance } = formData; //destructure
    const xlNum = parseFloat(xl);
    const xrNum = parseFloat(xr);
    const toleranceNum = parseFloat(tolerance);

    if (!equation || xl === "" || xr === "" || tolerance === "")
      return "Please fill in all fields.";

    if (isNaN(xlNum) || isNaN(xrNum) || isNaN(toleranceNum))
      return "xl, xr, and tolerance must be number";

    if (xlNum >= xrNum) return "xl must be less than xr";

    if (toleranceNum <= 0) return "error must be grather than 0";

    try {
      evaluate(equation, { x: 1 });
    } catch (er) {
      return "Invalid equation.";
    }

    return null;
  }, [formData]);

  ///calculate func
  const calBisection = useCallback(() => {
    const {
      equation,
      xl: xlString,
      xr: xrString,
      tolerance: toleranceString,
    } = formData;
    let xl = parseFloat(xlString);
    let xr = parseFloat(xrString);
    const tolerance = parseFloat(toleranceString);

    let xm,
      fXm,
      fXr,
      ea = 1;
    const MAX_ITERATION = 50;
    const data = []; //เก็บ data ในแต่ละรอบ

    //graph
    const iterations = [];
    const errors = [];

    let iter = 1;
    do {
      xm = (xl + xr) / 2;
      fXr = evaluate(equation, { x: xr });
      fXm = evaluate(equation, { x: xm });

      if (fXr * fXm > 0) {
        ea = Math.abs((xm - xr) / xm);
        xr = xm;
      } else {
        ea = Math.abs((xm - xl) / xm);
        xl = xm;
      }

      data.push({ iterations: iter, xL: xl, xM: xm, xR: xr, error: ea });
      errors.push(ea);
      iterations.push(iter);

      iter++;
    } while (iter <= MAX_ITERATION && ea > tolerance);

    setPlotdata({ iterations, errors });

    return {
      root: xm,
      iteration: data.length,
      data: data,
      XL: xl,
      XR: xr,
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
        const newResult = calBisection();
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
    [validateInput, calBisection]
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
            Bisection
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
                      <span className="label-text">xl</span>
                    </div>
                    <input
                      type="text"
                      placeholder="0"
                      className="input input-bordered w-32 justify-between"
                      id="xl"
                      onChange={handleInputChange}
                    />
                  </label>

                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">xr</span>
                    </div>
                    <input
                      type="text"
                      placeholder="5"
                      className="input input-bordered w-32 justify-between"
                      id="xr"
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
        <div className="my-8 w-full flex justify-center">
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
                  <th>Xl</th>
                  <th>Xr</th>
                  <th>Xm</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iterations}</td>
                    <td>{row.xL.toFixed(6)}</td>
                    <td>{row.xR.toFixed(6)}</td>
                    <td>{row.xM.toFixed(6)}</td>
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

export default Bisection;
