import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./productModal.css";
const BASE_URL = process.env.REACT_APP_API_URL;


const ProductModal = ({ show, onClose, mode = "add", onSave, product }) => {
    const [formProduct, setFormProduct] = useState({
        name: "",
        description: "",
        price: "",
        delPrice: "",
        discount: "",
        rating: "",
        category: "",
        image: "",
    });

    // Prefill when editing
    useEffect(() => {
        if (mode === "edit" && product) {
            setFormProduct({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                delPrice: product.delPrice || product.mrp || "",
                discount: product.discount || "",
                rating: product.rating || "",
                category: product.category || "",
                image: product.image || "",
            });
        } else {
            setFormProduct({
                name: "",
                description: "",
                price: "",
                delPrice: "",
                discount: "",
                rating: "",
                category: "",
                image: "",
            });
        }
    }, [mode, product, show]);

    const handleChange = (e) => {
        setFormProduct({ ...formProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formProduct.name || !formProduct.price) {
            toast.error("Name and Price are required!");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // JWT from login

            let url = `${BASE_URL}/api/products`;
            let method = "POST";

            // If editing, use PUT and include product ID in URL
            if (mode === "edit" && product?._id) {
                url = `${BASE_URL}/api/products/${product._id}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formProduct),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save product");
            }

            const data = await res.json();
            onSave(data);
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!show) return null;

    return (
        <div className="pm-wrapper">
            <div className="pm-backdrop" onClick={onClose}></div>
            <div className="pm-dialog">
                <div className="pm-content">
                    <div className="pm-header">
                        <h5 className="pm-title">
                            {mode === "add" ? "Add Product" : "Update Product"}
                        </h5>
                        <button className="pm-close" onClick={onClose}>
                            ✖
                        </button>
                    </div>
                    <div className="pm-body">
                        <form className="pm-form" onSubmit={handleSubmit}>
                            <div className="pm-field">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formProduct.name}
                                    onChange={handleChange}
                                    placeholder="Product name"
                                    required
                                />
                            </div>

                            <div className="pm-field">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formProduct.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                />
                            </div>

                            <div className="pm-row">
                                <div className="pm-col">
                                    <label>Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formProduct.price}
                                        onChange={handleChange}
                                        placeholder="Price"
                                        required
                                    />
                                </div>
                                <div className="pm-col">
                                    <label>M.R.P</label>
                                    <input
                                        type="number"
                                        name="delPrice"
                                        value={formProduct.delPrice}
                                        onChange={handleChange}
                                        placeholder="M.R.P"
                                    />
                                </div>
                            </div>

                            <div className="pm-row">
                                <div className="pm-col">
                                    <label>Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formProduct.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="pm-col">
                                    <label>Rating</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formProduct.rating}
                                        onChange={handleChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="pm-row">
                                <div className="pm-col">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={formProduct.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="mobile">Mobile</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="toys">Toys</option>
                                        <option value="grocery">Grocery</option>
                                    </select>
                                </div>
                                <div className="pm-col">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formProduct.image}
                                        onChange={handleChange}
                                        placeholder="Image URL"
                                    />
                                </div>
                            </div>

                            <div className="pm-actions">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="pm-btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="pm-btn-submit">
                                    {mode === "add" ? "Add" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
