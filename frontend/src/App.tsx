import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TransitPage from "./pages/TransitPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transit" element={<TransitPage />} />
    </Routes>
  );
}

export default App;