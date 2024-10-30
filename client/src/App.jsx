import { useState } from "react";
import Maincontent from "./Maincontent";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Maincontent />
    </>
  );
}

export default App;
