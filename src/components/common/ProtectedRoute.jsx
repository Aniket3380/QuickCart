import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../service/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/" />;

    // Admin can access everything
    if (user.role === "admin") return children;

    // If roles are defined, check if user role is allowed
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
