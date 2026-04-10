import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import TransitPage from "./pages/TransitPage";
import bgImage from "./assets/bubblePRNGrayInvertLong.jpg";
import BiwheelPage from "./pages/BiwheelPage";
import LandingPage from "./pages/LandingPage";
import { backendUrl } from "./constants/constants";
import Login from "./authLogin/Login";
import PrivateRoute from "./authLogin/service/PrivateRoute";
import UserOnlyPage from "./pages/UserOnlyPage";


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
        <Route path="/login" element={<Login url={backendUrl} />} />

        <Route element={<PrivateRoute />}>
          <Route path="/user" element={<UserOnlyPage />} />
        </Route>
        
        <Route path='/' element={<LandingPage />} />
        <Route path='/single' element={<Home />} />
        <Route path='/biwheel' element={<BiwheelPage />} />
      </Routes>
    </div>
  );
}

export default App;