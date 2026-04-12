import { Routes, Route } from 'react-router-dom'
import Layout from './layout/layout'

import Home from './pages/Home'
import BiwheelPage from './pages/BiwheelPage'
import LandingPage from './pages/LandingPage'
import Login from './authLogin/Login'
import PrivateRoute from './authLogin/service/PrivateRoute'
import UserOnlyPage from './pages/UserOnlyPage'
import { backendUrl } from './constants/constants'

function App() {
  return (
    <Routes>
      {/* ❌ χωρίς layout (login page) */}
      <Route path="/login" element={<Login url={backendUrl} />} />

      {/* ✅ με layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/single" element={<Home />} />
        <Route path="/biwheel" element={<BiwheelPage />} />

        {/* protected μέσα στο layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/user" element={<UserOnlyPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App