/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
const PrivateRoute = ({children}) => {
    const token = Cookies.get('token') || "";
    const isAuth = token !== "";
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
