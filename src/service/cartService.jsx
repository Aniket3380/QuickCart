// src/service/cartService.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;
// You might want to set baseURL in axios
const API = axios.create({
    baseURL: `${BASE_URL}/api/cart`,
});

// Add product to cart
export const addToCartAPI = async (productId, quantity = 1, token) => {
    const res = await API.post(
        "/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.cart;
};

// Get user's cart
export const getCartAPI = async (token) => {
    const res = await API.get("/", { headers: { Authorization: `Bearer ${token}` } });
    return res.data.cart;
};

// Update product quantity
export const updateCartAPI = async (productId, quantity, token) => {
    const res = await API.post(
        "/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.cart;
};

// Remove product from cart
export const removeFromCartAPI = async (productId, token) => {
    const res = await API.post(
        "/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.cart;
};