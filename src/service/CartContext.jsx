import React, { createContext, useState, useContext, useEffect } from "react";
import { addToCartAPI, getCartAPI, updateCartAPI, removeFromCartAPI } from "./cartService";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart on load
    useEffect(() => {
        if (user && token) {
            getCartAPI(token)
                .then(cart => {
                    // Ensure we get an array
                    setCartItems(cart.products || []);
                })
                .catch(err => console.error("Cart fetch error:", err));
        }
    }, [user, token]);

    const addToCart = async (product, quantity = 1) => {
        if (!user || !token) return toast.error("Please login to add to cart");

        const existingItem = cartItems.find(item => item.product._id === product._id);

        try {
            let cart;
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                cart = await updateCartAPI(product._id, newQuantity, token);
            } else {
                cart = await addToCartAPI(product._id, quantity, token);
            }

            setCartItems(cart.products || []);
            toast.success("Cart updated successfully!");
        } catch (err) {
            console.error("Add to cart error:", err);
            toast.error("Failed to update cart");
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user || !token) return;
        try {
            const cart = await updateCartAPI(productId, quantity, token);
            setCartItems(cart.products || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update quantity");
        }
    };

    const removeFromCart = async (productId) => {
        if (!user || !token) return;
        try {
            const cart = await removeFromCartAPI(productId, token);
            setCartItems(cart.products || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove product");
        }
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
