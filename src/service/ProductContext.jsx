import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
const BASE_URL = process.env.REACT_APP_API_URL;

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]); // displayed products
    const [allProducts, setAllProducts] = useState([]); // original products

    // Fetch all products from backend
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/products`);
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            setProducts(data);
            setAllProducts(data); // store original list
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const saveProduct = (product, mode) => {
        if (mode === "add") {
            setProducts((prev) => [...prev, product]);
            setAllProducts((prev) => [...prev, product]); // update original list
            toast.success("Product added successfully!");
        } else if (mode === "edit") {
            setProducts((prev) =>
                prev.map((p) => String(p._id) === String(product._id) ? product : p)
            );
            setAllProducts((prev) =>
                prev.map((p) => String(p._id) === String(product._id) ? product : p)
            );
            toast.success("Product updated successfully!");
        }
    };

    const refreshProducts = (newList) => {
        setProducts(newList);
    };

    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to delete product");
            }

            setProducts((prev) => prev.filter((p) => String(p._id) !== String(id)));
            setAllProducts((prev) => prev.filter((p) => String(p._id) !== String(id)));
            toast.success("Product deleted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <ProductContext.Provider
            value={{ products, allProducts, fetchProducts, saveProduct, deleteProduct, refreshProducts }}
        >
            {children}
        </ProductContext.Provider>
    );
};
