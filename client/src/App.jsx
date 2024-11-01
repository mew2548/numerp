import { useState } from "react";
import Maincontent from "./Maincontent";
import "./App.css";
import Show from "./Show";

function App() {
  const [showe, setShowe] = useState(true);

  return (
    <>
      <Maincontent setShowe={setShowe} />
      {showe && <Show />}
    </>
  );
}

export default App;
