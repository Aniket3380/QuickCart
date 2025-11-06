import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../service/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserProfile.css";
const BASE_URL = process.env.REACT_APP_API_URL;

// Main UserProfile Component
const UserProfile = () => {
    const { user: authUser, token } = useAuth();
    const userId = authUser?._id;
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const [user, setUser] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");

    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        age: "",
        gender: "",
        profilePicture: "",
    });

    const [payments, setPayments] = useState([]);
    const [addPaymentMode, setAddPaymentMode] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        type: "Visa",
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: "",
    });

    const [addresses, setAddresses] = useState([]);
    const [addAddressMode, setAddAddressMode] = useState(false);
    const [addressForm, setAddressForm] = useState({
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
    });

    const [orders, setOrders] = useState([]);

    // Fetch user info
    const fetchUser = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/${userId}`, headers);
            setUser(res.data);
            setFormData({
                fullname: res.data.fullname || "",
                phone: res.data.phone || "",
                age: res.data.age || "",
                gender: res.data.gender || "",
                profilePicture: res.data.profilePicture || "",
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch user details");
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/${userId}/payments`, headers);
            setPayments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/${userId}/addresses`, headers);
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/orders/history/${userId}`, headers);
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUser();
            fetchPayments();
            fetchAddresses();
            fetchOrders();
        }
    }, [userId]);

    useEffect(() => {
        setIsEditingProfile(false);
        setAddPaymentMode(false);
        setAddAddressMode(false);
        setPaymentForm({ type: "Visa", cardNumber: "", expiry: "", cvv: "", upiId: "" });
        setAddressForm({ line1: "", line2: "", city: "", state: "", zip: "" });
    }, [activeTab]);

    // Profile Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${BASE_URL}/api/users/${userId}`, formData, headers);
            setUser(res.data);
            setIsEditingProfile(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    // Payments Handlers
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/users/${userId}/payments`, paymentForm, headers);
            setAddPaymentMode(false);
            setPaymentForm({ type: "Visa", cardNumber: "", expiry: "", cvv: "", upiId: "" });
            fetchPayments();
            toast.success("Payment added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add payment");
        }
    };

    const handleDeletePayment = async (paymentId) => {
        try {
            await axios.delete(`${BASE_URL}/api/users/${userId}/payments/${paymentId}`, headers);
            fetchPayments();
        } catch (err) {
            console.error(err);
        }
    };

    // Addresses Handlers
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/users/${userId}/addresses`, addressForm, headers);
            setAddAddressMode(false);
            setAddressForm({ line1: "", line2: "", city: "", state: "", zip: "" });
            fetchAddresses();
            toast.success("Address added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add address");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`${BASE_URL}/api/users/${userId}/addresses/${addressId}`, headers);
            fetchAddresses();
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <p>Loading user details...</p>;

    return (
        <div className="container py-4">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* User Header */}
            <div className="card p-4 mb-3 shadow-sm user-header d-flex flex-row flex-wrap align-items-center gap-2">
                <img
                    src={user.profilePicture || "https://via.placeholder.com/60"}
                    alt="User"
                    className="rounded-circle shadow-sm me-3"
                    width="60"
                    height="60"
                />
                <div className="user-info">
                    <h6 className="fw-bold mb-0">{user.fullname}</h6>
                    <small className="text-muted">{user.email}</small>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>Profile</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "payments" ? "active" : ""}`} onClick={() => setActiveTab("payments")}>Payments</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "addresses" ? "active" : ""}`} onClick={() => setActiveTab("addresses")}>Addresses</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>Orders</button>
                </li>
            </ul>

            {/* Profile Tab */}
            {activeTab === "personal" && (
                <div className="tab-pane active">
                    <div className="card shadow-sm p-3 mb-3 position-relative">
                        <button
                            className="btn btn-outline-primary btn-sm position-absolute top-2 end-2"
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                        >
                            {isEditingProfile ? "Cancel" : "Edit"}
                        </button>

                        {!isEditingProfile ? (
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                <img
                                    src={user.profilePicture || "https://via.placeholder.com/100"}
                                    alt="Profile"
                                    className="rounded-circle shadow-sm mb-3 mb-md-0 me-md-4"
                                    width="100"
                                    height="100"
                                />
                                <div>
                                    <p><strong>Name:</strong> {user.fullname}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Phone:</strong> {user.phone}</p>
                                    <p><strong>Age:</strong> {user.age}</p>
                                    <p><strong>Gender:</strong> {user.gender}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile}>
                                <div className="row gy-3">
                                    <div className="col-md-3 text-center">
                                        <img
                                            src={formData.profilePicture || "https://via.placeholder.com/100"}
                                            alt="Profile"
                                            className="rounded-circle shadow-sm mb-2"
                                            width="100"
                                            height="100"
                                        />
                                        <input type="file" className="form-control form-control-sm mt-2" onChange={handleFileChange} />
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control mb-2" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Name" />
                                        <input className="form-control mb-2" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                                            </div>
                                            <div className="col-md-6">
                                                <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-success mt-3">Save</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
                <div className="tab-pane active">
                    <PaymentTab
                        payments={payments}
                        addPaymentMode={addPaymentMode}
                        setAddPaymentMode={setAddPaymentMode}
                        paymentForm={paymentForm}
                        setPaymentForm={setPaymentForm}
                        handlePaymentChange={handlePaymentChange}
                        handleAddPayment={handleAddPayment}
                        handleDeletePayment={handleDeletePayment}
                    />
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
                <div className="tab-pane active">
                    <AddressTab
                        addresses={addresses}
                        addAddressMode={addAddressMode}
                        setAddAddressMode={setAddAddressMode}
                        addressForm={addressForm}
                        handleAddressChange={handleAddressChange}
                        handleAddAddress={handleAddAddress}
                        handleDeleteAddress={handleDeleteAddress}
                    />
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <div className="tab-pane active">
                    {orders.length === 0 ? (
                        <p className="text-muted">No orders found.</p>
                    ) : (
                        <div className="row g-3">
                            {orders.map((order, index) => (
                                <OrderCard key={order._id} order={order} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;

// ==================== Payment Tab ====================
const PaymentTab = ({
    payments,
    addPaymentMode,
    setAddPaymentMode,
    paymentForm,
    setPaymentForm,
    handlePaymentChange,
    handleAddPayment,
    handleDeletePayment,
}) => {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-header d-flex justify-content-between bg-success text-white">
                <span>Payment Methods</span>
                <button className="btn btn-light btn-sm" onClick={() => setAddPaymentMode(!addPaymentMode)}>
                    {addPaymentMode ? "Cancel" : "Add"}
                </button>
            </div>
            <div className="card-body">
                {!addPaymentMode ? (
                    payments.length === 0 ? (
                        <p className="text-muted">No payments found.</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {payments.map((p) => (
                                <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        {p.type === "UPI"
                                            ? p.upiId
                                            : `**** **** **** ${p.cardNumber ? p.cardNumber.slice(-4) : "0000"} (Exp: ${p.expiry})`}
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePayment(p._id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <form onSubmit={handleAddPayment} className="mt-3 row g-2">
                        <div className="col-md-3">
                            <select className="form-select" name="type" value={paymentForm.type} onChange={handlePaymentChange}>
                                <option value="Visa">Card</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>
                        {paymentForm.type === "Visa" ? (
                            <>
                                <div className="col-md-3">
                                    <input name="cardNumber" className="form-control" placeholder="Card Number" value={paymentForm.cardNumber} onChange={handlePaymentChange} />
                                </div>
                                <div className="col-md-3">
                                    <input type="month" name="expiry" className="form-control" value={paymentForm.expiry} onChange={handlePaymentChange} />
                                </div>
                                <div className="col-md-3">
                                    <input name="cvv" className="form-control" placeholder="CVV" value={paymentForm.cvv} onChange={handlePaymentChange} />
                                </div>
                            </>
                        ) : (
                            <div className="col-md-6">
                                <input name="upiId" className="form-control" placeholder="UPI ID" value={paymentForm.upiId} onChange={handlePaymentChange} />
                            </div>
                        )}
                        <div className="col-md-3">
                            <button className="btn btn-success w-100" type="submit">Add</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// ==================== Address Tab ====================
const AddressTab = ({ addresses, addAddressMode, setAddAddressMode, addressForm, handleAddressChange, handleAddAddress, handleDeleteAddress }) => (
    <div className="card mb-3 shadow-sm">
        <div className="card-header d-flex justify-content-between bg-info text-white">
            <span>Addresses</span>
            <button className="btn btn-light btn-sm" onClick={() => setAddAddressMode(!addAddressMode)}>
                {addAddressMode ? "Cancel" : "Add"}
            </button>
        </div>
        <div className="card-body">
            {!addAddressMode ? (
                addresses.length === 0 ? (
                    <p className="text-muted">No addresses found.</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {addresses.map((a) => (
                            <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>{a.line1}, {a.line2}, {a.city}, {a.state} - {a.zip}</div>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(a._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )
            ) : (
                <form onSubmit={handleAddAddress} className="row g-2">
                    <div className="col-md-6"><input name="line1" className="form-control" placeholder="Address Line 1" value={addressForm.line1} onChange={handleAddressChange} /></div>
                    <div className="col-md-6"><input name="line2" className="form-control" placeholder="Address Line 2" value={addressForm.line2} onChange={handleAddressChange} /></div>
                    <div className="col-md-4"><input name="city" className="form-control" placeholder="City" value={addressForm.city} onChange={handleAddressChange} /></div>
                    <div className="col-md-4"><input name="state" className="form-control" placeholder="State" value={addressForm.state} onChange={handleAddressChange} /></div>
                    <div className="col-md-4"><input name="zip" className="form-control" placeholder="ZIP" value={addressForm.zip} onChange={handleAddressChange} /></div>
                    <div className="col-md-3 mt-2"><button className="btn btn-success w-100" type="submit">Add</button></div>
                </form>
            )}
        </div>
    </div>
);

// ==================== Order Card ====================
const OrderCard = ({ order, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
                <div className="card-body" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
                    <h6 className="card-title">Order #{index + 1}</h6>
                    <p className="mb-1"><strong>Total:</strong> ₹{order.payment.total.toLocaleString()}</p>
                    <p className="mb-1"><strong>Items:</strong> {order.items.map(i => i.name).join(", ")}</p>
                    <p className="mb-0 text-muted"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                    {expanded && (
                        <div className="mt-3 border-top pt-2">
                            <h6>Payment Details:</h6>
                            <p className="mb-1"><strong>Method:</strong> {order.payment.method.toUpperCase()}</p>
                            {order.payment.method === "card" && (
                                <p className="mb-1"><strong>Card:</strong> **** **** **** {order.payment.details.cardNumber.slice(-4)} (Exp: {order.payment.details.expiry})</p>
                            )}
                            {order.payment.method === "upi" && (
                                <p className="mb-1"><strong>UPI ID:</strong> {order.payment.details.upiId}</p>
                            )}
                            <h6 className="mt-2">Items:</h6>
                            <ul className="list-group list-group-flush">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="list-group-item d-flex align-items-center gap-2 p-2">
                                        <img src={item.image} alt={item.name} width="50" height="50" className="rounded" />
                                        <div>
                                            <p className="mb-0">{item.name}</p>
                                            <small>₹{item.price.toLocaleString()} × {item.quantity}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
