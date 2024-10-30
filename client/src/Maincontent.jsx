import { typeOf } from "mathjs";
import React from "react";
import { useState } from "react";

///component
import Bisection from "./components/Bisection";
import FalsePosition from "./components/Falseposition";
import NewtonRaphson from "./components/Newton";
import Onepoint from "./components/Onepoint";
import Secant from "./components/Secant";
function Maincontent() {
  const [typeProb, setTypeProb] = useState("");
  const [sol, setSol] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");

  const typeOfProb = [
    { label: "Root Equations", value: "Root Equations" },
    { label: "Linear Algebra", value: "Linear Algebra" },
    { label: "Interpolation", value: "Interpolation" },
    { label: "Extrapolation", value: "Extrapolation" },
    { label: "Integration", value: "Integration" },
    { label: "Differentiation", value: "Differentiation" },
  ];

  const solution = {
    "Root Equations": [
      "Graphical Methods",
      "Bisection Methods",
      "False-Position Methods",
      "One-Point Iteration Methods",
      "Newton-Raphson Methods",
      "Secant Methods",
    ],
    "Linear Algebra": [
      "Cramer's Rule",
      "Gauss Elimination",
      "Gauss-Jordan Elimination",
      "Matrix Inversion",
      "LU Decomposition Methods",
      "Cholesky Decomposition Methods",
      "Jacobi Iteration Methods",
      "Gauss-Seidel Methods",
      "Conjugate Gradient Methods",
    ],
    Interpolation: [
      "Newton divided-differences",
      "Lagrange Interpolation",
      "Spline Interpolation",
    ],
    Extrapolation: ["Simple Regression", "Multiple Regression"],
    Integration: [
      "Trapezoidal Rule",
      "Composite Trapezoidal Rule",
      "Simpson Rule",
      "Composite Simpson Rule",
    ],
    Differentiation: ["Numerical Differentiation"],
  };

  const renderComponet = function () {
    switch (selectedMethod) {
      case "Bisection Methods":
        return <Bisection />;
      case "False-Position Methods":
        return <FalsePosition />;
      case "One-Point Iteration Methods":
        return <Onepoint />;
      case "Newton-Raphson Methods":
        return <NewtonRaphson />;
      case "Secant Methods":
        return <Secant />;
      case "Cramer's Rule":
        return <Cramer />;
      default:
        return null;
    }
  };
  const handleMethodchange = (e) => {
    setSelectedMethod(e.target.value);
  };
  function handleType(e) {
    const selectedType = e.target.value;
    setTypeProb(selectedType);
    setSol(solution[selectedType] || []);
    setSelectedMethod("");
  }
  return (
    <>
      <div className="hero w-full mt-5 flex flex-col justify-center items-center bg-[#ffbaca] rounded-3xl">
        <h1 className="text-[#553c20] font-semibold text-4xl mt-5">
          Numer calculator
        </h1>
        <div className="card flex-row min-w-full justify-around">
          <select
            className="select select-secondary w-full max-w-xs"
            name="problemType"
            id="problemType"
            onChange={handleType}
            value={typeProb}
          >
            <option>Select type of problem</option>
            {typeOfProb.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="select select-secondary w-full max-w-xs"
            name="solutionMethod"
            id="solutionMethod"
            disabled={sol.length === 0}
            onChange={handleMethodchange}
            value={selectedMethod}
          >
            <option disable selected value="">
              choose method
            </option>
            {sol.map((s, index) => (
              <option key={index} value={s}>
                {" "}
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {renderComponet()}
    </>
  );
}

export default Maincontent;
