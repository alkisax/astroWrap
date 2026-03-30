import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import TransitPage from "./pages/TransitPage";
import bgImage from "./assets/bubblePRNGrayInvertLong.jpg";
import BiwheelPage from "./pages/BiwheelPage";


function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
        backgroundColor: "black",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/transit" element={<TransitPage />} /> */}
        <Route path="/biwheel" element={<BiwheelPage />} />
      </Routes>
    </div>
  );
}

export default App;