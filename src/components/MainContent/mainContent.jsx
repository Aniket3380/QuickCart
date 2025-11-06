import React, { useContext, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Dropdown, DropdownButton } from "react-bootstrap";
import "./mainContent.css";
import { AuthContext } from "../../service/AuthContext";
import ProductModal from "../add_update_product/productModal";
import { ProductContext } from "../../service/ProductContext";
import { useCart } from "../../service/CartContext";

// View-only product info modal
const ProductInfoModal = ({ show, onClose, product }) => {
    if (!show || !product) return null;

    return (
        <div className="modal-backdrop">
            <div className="product-info-modal">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-content text-center">
                    <img src={product.image} alt={product.name} className="product-info-img mb-2" />
                    <h5>{product.name}</h5>
                    <p>Category: {product.category || "N/A"}</p>
                    <p>Price: ₹{product.price}</p>
                    {product.delPrice && <p>MRP: ₹{product.delPrice}</p>}
                    {product.discount && <p>Discount: {product.discount}% OFF</p>}
                    {product.rating && <p>Rating: {product.rating} ⭐</p>}
                    {product.description && <p>{product.description}</p>}
                </div>
            </div>
        </div>
    );
};

const offers = [
    { id: 1, image: "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/45348602ad4b2259.jpg?q=90" },
    { id: 2, image: "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/193fafd4370237b8.jpg?q=90" },
    { id: 3, image: "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/05cba11116281817.jpeg?q=90" },
];

const MainContent = () => {
    const { products, deleteProduct, saveProduct } = useContext(ProductContext);
    const { user } = useContext(AuthContext);
    const { addToCart } = useCart();

    const isAdminOrSuper = user?.role === "admin" || user?.role === "superadmin";

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [currentProduct, setCurrentProduct] = useState(null);

    // Product info modal
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [sortOrder, setSortOrder] = useState("");

    const categories = useMemo(() => {
        return Array.from(new Set(products.map((p) => p.category?.toLowerCase().trim()))).filter(Boolean);
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (categoryFilter) {
            result = result.filter((p) => p.category?.toLowerCase() === categoryFilter.toLowerCase());
        }

        if (priceFilter !== "all") {
            const [min, max] = priceFilter.split("-").map(Number);
            result = result.filter((p) => p.price >= min && p.price <= max);
        }

        if (ratingFilter > 0) {
            result = result.filter((p) => p.rating >= ratingFilter);
        }

        if (sortOrder === "asc") result.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortOrder === "desc") result.sort((a, b) => b.name.localeCompare(a.name));

        return result;
    }, [products, categoryFilter, priceFilter, ratingFilter, sortOrder]);

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setModalMode("edit");
        setModalOpen(true);
    };

    const handleSave = (product) => {
        saveProduct(product, modalMode === "add" ? "add" : "edit");
        setModalOpen(false);
    };

    const handleDelete = (productId) => {
        deleteProduct(productId);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
        setInfoModalOpen(true);
    };

    return (
        <main className="main-content container py-2">
            {/* Carousel */}
            <Carousel className="mb-3 rounded shadow-sm">
                {offers.map((offer) => (
                    <Carousel.Item key={offer.id}>
                        <img
                            className="d-block w-100"
                            src={offer.image}
                            alt={offer.title}
                            style={{ height: "250px", objectFit: "cover", borderRadius: "15px" }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Filters */}
            <div className="d-flex gap-3 mb-3 flex-wrap align-items-center">
                <DropdownButton
                    id="dropdown-category"
                    title={categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : "Category"}
                    onSelect={(val) => setCategoryFilter(val)}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey="">All</Dropdown.Item>
                    {categories.map((c) => (
                        <Dropdown.Item key={c} eventKey={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>

                <DropdownButton
                    id="dropdown-price"
                    title={priceFilter === "all" ? "Price" : `₹${priceFilter.replace("-", " - ₹")}`}
                    onSelect={(val) => setPriceFilter(val)}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey="all">All</Dropdown.Item>
                    <Dropdown.Item eventKey="0-5000">₹0 - ₹5000</Dropdown.Item>
                    <Dropdown.Item eventKey="5000-10000">₹5000 - ₹10000</Dropdown.Item>
                    <Dropdown.Item eventKey="10000-50000">₹10000 - ₹50000</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    id="dropdown-rating"
                    title={ratingFilter ? `${ratingFilter} ⭐ & above` : "Rating"}
                    onSelect={(val) => setRatingFilter(Number(val))}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey={0}>All Ratings</Dropdown.Item>
                    <Dropdown.Item eventKey={1}>1 ⭐ & above</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>2 ⭐ & above</Dropdown.Item>
                    <Dropdown.Item eventKey={3}>3 ⭐ & above</Dropdown.Item>
                    <Dropdown.Item eventKey={4}>4 ⭐ & above</Dropdown.Item>
                    <Dropdown.Item eventKey={5}>5 ⭐ only</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    id="dropdown-sort"
                    title={sortOrder === "asc" ? "A-Z" : sortOrder === "desc" ? "Z-A" : "Sort"}
                    onSelect={(val) => setSortOrder(val)}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey="">None</Dropdown.Item>
                    <Dropdown.Item eventKey="asc">A-Z</Dropdown.Item>
                    <Dropdown.Item eventKey="desc">Z-A</Dropdown.Item>
                </DropdownButton>
            </div>

            {/* Product Grid */}
            <div className="row g-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product._id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                            <div className="product-card card text-center h-100 border-0 shadow-sm">
                                <div className="position-relative p-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-img mx-auto d-block"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleView(product)} // <-- view product info
                                    />
                                    {product.discount && <span className="discount-badge">{product.discount}% OFF</span>}
                                </div>
                                <div className="card-body p-2">
                                    <h6 className="card-title">
                                        {product.name.length > 30 ? product.name.slice(0, 30) + "..." : product.name}
                                    </h6>
                                    <div className="price-wrapper mb-2">
                                        <span className="price">₹{product.price}</span>
                                        {product.delPrice && <span className="mrp">₹{product.delPrice}</span>}
                                    </div>
                                    {product.rating && <div className="mb-2">{product.rating} ⭐</div>}

                                    <button
                                        className="btn add-to-cart w-100 mb-1"
                                        onClick={() => addToCart(product, 1)}
                                    >
                                        Add to Cart
                                    </button>

                                    {isAdminOrSuper && (
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-sm btn-warning w-48"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger w-48"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5">No products found</div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <ProductModal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                mode={modalMode}
                onSave={handleSave}
                product={currentProduct}
            />

            {/* Product Info Modal */}
            <ProductInfoModal
                show={infoModalOpen}
                onClose={() => setInfoModalOpen(false)}
                product={selectedProduct}
            />
        </main>
    );
};

export default MainContent;
