// frontend\src\authLogin\service\StaffPrivateRoute.tsx
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";

const StaffPrivateRoute = () => {
  const { user } = useContext(UserAuthContext);

  if (user && user.roles?.includes("STAFF")) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default StaffPrivateRoute;