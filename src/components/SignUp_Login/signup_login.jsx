import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup_login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../service/AuthContext";
const BASE_URL = process.env.REACT_APP_API_URL;

const SignUpLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [isSignup, setIsSignup] = useState(location.pathname.includes("signup"));

    useEffect(() => {
        setIsSignup(location.pathname.includes("signup"));
    }, [location.pathname]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ type: "", message: "" });

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "fullname":
                if (isSignup && !value.match(/^[a-zA-Z\s]{3,50}$/)) {
                    error = "Full Name must be 3-50 letters";
                }
                break;
            case "phone":
                if (isSignup && !value.match(/^[6-9]\d{9}$/)) {
                    error = "Invalid phone number";
                }
                break;
            case "email":
                if (!value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
                    error = "Enter a valid email";
                }
                break;
            case "password":
                if (!value.match(/.{8,}/)) {
                    error = "Password must be at least 8 characters";
                }
                break;
            case "confirmPassword":
                if (isSignup && value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const validationErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) validationErrors[key] = error;
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (isSignup) {
                const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);
                setAlert({ type: "success", message: "Registered successfully 🎉 Please login now." });

                // Reset form and switch to login
                setFormData({
                    fullname: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });
                setErrors({});
                setIsSignup(false);
            } else {
                const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                    email: formData.email,
                    password: formData.password,
                });

                // Update global auth context
                login(res.data.user, res.data.token);

                toast.success(`Login successful ✅ Welcome ${res.data.user.fullname}`);
                setTimeout(() => navigate("/"), 500);
            }
        } catch (err) {
            setAlert({
                type: "danger",
                message: err.response?.data?.message || "Something went wrong",
            });
        }
    };

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setFormData({
            fullname: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        });
        setErrors({});
        setAlert({ type: "", message: "" });
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="card shadow-lg auth-card">
                <div className="card-body p-4">
                    <h2 className="text-center mb-3">{isSignup ? "Sign Up" : "Login"}</h2>

                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <input
                                        type="text"
                                        name="fullname"
                                        className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                                        placeholder="Full Name"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                    />
                                    {errors.fullname && <small className="text-danger">{errors.fullname}</small>}
                                </div>
                                <div className="col-6">
                                    <input
                                        type="tel"
                                        name="phone"
                                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                </div>
                            </div>
                        )}

                        <div className="mb-2 position-relative">
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        <div className={isSignup ? "row g-2 mb-3" : "mb-3"}>
                            <div className={isSignup ? "col-6 position-relative" : "position-relative"}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <small className="text-danger">{errors.password}</small>}
                            </div>

                            {isSignup && (
                                <div className="col-6 position-relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                </div>
                            )}
                        </div>

                        <button type="submit" className={`btn w-100 ${isSignup ? "btn-primary" : "btn-success"}`}>
                            {isSignup ? "Sign Up" : "Login"}
                        </button>
                    </form>

                    <p className="mt-2 text-center">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <span className="text-primary fw-bold cursor-pointer" onClick={toggleForm}>
                            {isSignup ? "Login" : "Sign Up"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpLogin;
