import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const API_URL = `${BASE_URL}/api/auth`;

// Register user
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

// Login user
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

// Get JWT token
export const getToken = () => localStorage.getItem("token");

// Logout
export const logout = () => localStorage.removeItem("token");

// Axios instance with token
export const authAxios = axios.create();

authAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
