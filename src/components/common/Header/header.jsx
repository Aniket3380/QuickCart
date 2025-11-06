import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../../service/AuthContext";
import { CartContext } from "../../../service/CartContext";
import { ProductContext } from "../../../service/ProductContext";
import ProductModal from "../../add_update_product/productModal";
import "./header.css";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { refreshProducts, saveProduct, products, allProducts } = useContext(ProductContext);

    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const lastSearchRef = useRef("");
    const originalProductsRef = useRef([]);

    useEffect(() => {
        if (products.length && originalProductsRef.current.length === 0) {
            originalProductsRef.current = products;
        }
    }, [products]);

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            refreshProducts(allProducts);
            lastSearchRef.current = "";
            return;
        }

        if (term === lastSearchRef.current) return;

        const debounce = setTimeout(() => {
            const filtered = allProducts.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    (p.category && p.category.toLowerCase().includes(term))
            );
            refreshProducts(filtered);
            lastSearchRef.current = term;
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchTerm, allProducts, refreshProducts]);

    const handleLogout = () => {
        toast.success("Logout successfully...");
        logout();
        navigate("/");
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <header className="header">
                <div className="header-left">
                    <div className="logo" onClick={() => navigate("/")}>
                        <span className="logo-text-quick">Quick</span>
                        <span className="logo-text-c">Cart</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="header-center-wrapper">
                    <nav className="header-center">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                    </nav>
                </div>

                {/* Hamburger for mobile */}
                <div className="hamburger" onClick={() => setMobileMenuOpen(true)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Desktop Right Section */}
                <div className="header-right">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {!user ? (
                        <button className="auth-btn" onClick={() => navigate("/auth/login")}>
                            Login / Signup
                        </button>
                    ) : (
                        <>
                            <button
                                className="icon-btn position-relative"
                                onClick={() => navigate("/cart")}
                            >
                                🛒 <span className="cart-badge">{cartItems.length}</span>
                            </button>

                            <div className="profile-dropdown">
                                <button className="auth-btn">{user.fullname} &#9662;</button>
                                <div className="dropdown-content">
                                    {user.role === "user" && (
                                        <button onClick={() => navigate("/user/profile")}>Profile</button>
                                    )}
                                    {user.role === "admin" && (
                                        <>
                                            <button onClick={() => navigate("/admin/profile")}>Profile</button>
                                            <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
                                            <button onClick={() => setShowModal(true)}>Add Product</button>
                                        </>
                                    )}
                                    {user.role === "superadmin" && (
                                        <>
                                            <button onClick={() => navigate("/superadmin/profile")}>Profile</button>
                                            <button onClick={() => navigate("/superadmin/dashboard")}>SuperAdmin</button>
                                            <button onClick={() => setShowModal(true)}>Add Product</button>
                                        </>
                                    )}
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Sidebar */}
                <div className={`mobile-sidebar ${mobileMenuOpen ? "show" : ""}`}>
                    <span className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                        &times;
                    </span>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Links */}
                    <a className="sidebarlink" href="/" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a className="sidebarlink" href="/about" onClick={() => setMobileMenuOpen(false)}>About</a>
                    <a className="sidebarlink" href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>

                    {/* Cart Button */}
                    {user && (
                        <button
                            className="icon-btn position-relative"
                            onClick={() => { navigate("/cart"); setMobileMenuOpen(false); }}
                        >
                            🛒 <span className="cart-badge">{cartItems.length}</span>
                        </button>
                    )}

                    {/* User Dropdown */}
                    {!user ? (
                        <button
                            className="auth-btn"
                            onClick={() => { navigate("/auth/login"); setMobileMenuOpen(false); }}
                        >
                            Login / Signup
                        </button>
                    ) : (
                        <div className="mobile-profile-dropdown">
                            <button className="auth-btn">{user.fullname} &#9662;</button>
                            <div className="mobile-dropdown-content">
                                {user.role === "user" && (
                                    <button onClick={() => { navigate("/user/profile"); setMobileMenuOpen(false); }}>Profile</button>
                                )}
                                {user.role === "admin" && (
                                    <>
                                        <button onClick={() => { navigate("/admin/profile"); setMobileMenuOpen(false); }}>Profile</button>
                                        <button onClick={() => { navigate("/admin/dashboard"); setMobileMenuOpen(false); }}>Dashboard</button>
                                        <button onClick={() => { setShowModal(true); setMobileMenuOpen(false); }}>Add Product</button>
                                    </>
                                )}
                                {user.role === "superadmin" && (
                                    <>
                                        <button onClick={() => { navigate("/superadmin/profile"); setMobileMenuOpen(false); }}>Profile</button>
                                        <button onClick={() => { navigate("/superadmin/dashboard"); setMobileMenuOpen(false); }}>SuperAdmin</button>
                                        <button onClick={() => { setShowModal(true); setMobileMenuOpen(false); }}>Add Product</button>
                                    </>
                                )}
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>

            </header >

            {/* Add Product Modal */}
            < ProductModal
                show={showModal}
                onClose={() => setShowModal(false)}
                mode="add"
                onSave={(product) => {
                    saveProduct(product, "add");
                    originalProductsRef.current = [...originalProductsRef.current, product];
                }}
            />
        </>
    );
};

export default Header;
