import React from "react";
import { useState, useCallback, useEffect } from "react";
import { det } from "mathjs";

function Cramer() {
  const [formData, setFormData] = useState({
    n: 3,
    matA: Array(3)
      .fill()
      .map(() => (3).fill("")),
    matB: Array(3).fill(""),
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = useCallback((e) => {}, []);
}
