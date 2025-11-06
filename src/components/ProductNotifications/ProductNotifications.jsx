
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../service/ProductContext";
import { useAuth } from "../../service/AuthContext";
import "./ProductNotifications.css";

const ProductNotifications = () => {
    const { user } = useAuth();
    const { products } = useContext(ProductContext); // Use context instead of polling
    const [latestProduct, setLatestProduct] = useState(null);

    useEffect(() => {
        if (!user || !products || products.length === 0) return;

        // Get the most recently added product
        const newest = products[products.length - 1];

        setLatestProduct(newest);

        // Auto-hide notification after 5 seconds
        const timer = setTimeout(() => setLatestProduct(null), 5000);

        return () => clearTimeout(timer);
    }, [products, user]);

    if (!latestProduct) return null;

    return (
        <div className="product-notification">
            <div className="product-notification-content">
                {latestProduct.image && (
                    <img
                        src={latestProduct.image}
                        alt={latestProduct.name}
                        className="product-notification-image"
                    />
                )}
                <div className="product-notification-info">
                    <strong>{latestProduct.name}</strong>
                    <p className="category">{latestProduct.category}</p>
                    <p className="price">₹{latestProduct.price.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductNotifications;
