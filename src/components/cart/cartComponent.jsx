import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../service/CartContext";
import { useNavigate } from "react-router-dom";
import "./cartComponent.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../../service/AuthContext";
const BASE_URL = process.env.REACT_APP_API_URL;

const Cart = () => {
    const { user: authUser, token } = useAuth();
    const userId = authUser?._id;
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);

    // saved addresses & payments
    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);

    // selected values
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch addresses
    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/${userId}/addresses`, headers);
            setAddresses(res.data);
        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    };

    // Fetch payments
    const fetchPayments = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/${userId}/payments`, headers);
            setPayments(res.data);
        } catch (err) {
            console.error("Error fetching payments:", err);
        }
    };

    useEffect(() => {
        if (showCheckout) {
            fetchAddresses();
            fetchPayments();
        }
    }, [showCheckout]);

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const discount = total > 1000 ? total * 0.1 : 0;
    const finalAmount = total - discount;

    const handleIncrement = async (productId, currentQty) => {
        await updateQuantity(productId, currentQty + 1);
        toast.success("Quantity increased successfully!");
    };

    const handleDecrement = async (productId, currentQty) => {
        if (currentQty > 1) {
            await updateQuantity(productId, currentQty - 1);
            toast.success("Quantity decreased successfully!");
        }
    };

    const handleRemove = async (productId) => {
        await removeFromCart(productId);
        toast.success("Product removed from cart!");
    };

    const handleConfirmOrder = async () => {
        if (!userId) return toast.error("User not logged in");
        if (!cartItems.length) return toast.error("Cart is empty");
        if (!selectedAddress) return toast.error("Please select a delivery address!");
        if (!selectedPayment) return toast.error("Please select a payment method!");

        // Find selected payment
        const paymentObj = payments.find(p => p._id === selectedPayment);
        if (!paymentObj) return toast.error("Invalid payment method");

        // Map cart items correctly
        const items = cartItems.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        // Normalize paymentMethod to 'card' or 'upi'
        let paymentMethod = '';
        let paymentDetails = {};

        if (paymentObj.type.toLowerCase() === 'upi') {
            paymentMethod = 'upi';
            paymentDetails = {
                cardNumber: "",
                expiry: "",
                cvv: "",
                upiId: paymentObj.upiId || ""
            };
        } else {
            paymentMethod = 'card';
            paymentDetails = {
                cardNumber: paymentObj.cardNumber || "",
                expiry: paymentObj.expiry || "",
                cvv: paymentObj.cvv || "",
                upiId: ""
            };
        }

        // Construct payload
        const payload = {
            userId,
            items,
            total: finalAmount,
            paymentMethod,
            paymentDetails
        };

        try {
            const res = await axios.post(
                `${BASE_URL}/api/orders/place-order`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Order placed successfully!");
                clearCart();
                setShowCheckout(false);
                navigate("/orders");
            } else {
                toast.error(res.data.message || "Failed to place order");
            }
        } catch (err) {
            console.error("Place order error:", err.response?.data || err);
            toast.error("Server error. Check console.");
        }
    };

    const goToShop = () => navigate("/");

    return (
        <div className="cart-wrapper">
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h3 className="cart-title">Shopping Cart</h3>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                        alt="Empty Cart"
                        className="empty-cart-img"
                    />
                    <h2 className="empty-cart-title">Oops! Your cart is empty</h2>
                    <p className="empty-cart-desc">
                        Looks like you haven't added anything yet. Start shopping and fill your cart with amazing products!
                    </p>
                    <button className="btn shop-now-btn" onClick={goToShop}>🛒 Shop Now</button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h5>{item.product.name}</h5>
                                    <p className="cart-item-price">₹{item.product.price?.toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleDecrement(item.product._id, item.quantity)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleIncrement(item.product._id, item.quantity)}>+</button>
                                    </div>
                                    <button className="btn btn-sm btn-danger remove-btn" onClick={() => handleRemove(item.product._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer">
                        <h4>Total: ₹{finalAmount.toFixed(2)}</h4>
                        <button className="btn btn-primary checkout-btn" onClick={() => setShowCheckout(true)}>Proceed to Checkout</button>
                    </div>

                    {showCheckout && (
                        <div className="checkout-popup-overlay">
                            <div className="checkout-popup">
                                <h2>Checkout</h2>

                                {/* Address */}
                                <div className="form-group">
                                    <label>Delivery Address</label>
                                    {addresses.length ? (
                                        <select value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)}>
                                            <option value="">Select Address</option>
                                            {addresses.map(addr => (
                                                // <option key={addr._id} value={addr._id}>{addr.street}, {addr.city}, {addr.zip}</option>
                                                <option key={addr._id} value={addr._id}>
                                                    {`${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.state}, ${addr.zip}, ${addr.country}`}
                                                </option>
                                            ))}
                                        </select>
                                    ) : <p>No saved addresses found.</p>}
                                </div>

                                {/* Payment */}
                                <div className="form-group">
                                    <label>Payment Method</label>
                                    {payments.length ? (
                                        <select value={selectedPayment} onChange={e => setSelectedPayment(e.target.value)}>
                                            <option value="">Select Payment</option>
                                            {payments.map(pay => {
                                                const display = pay.type === "UPI" ? pay.upiId : pay.cardNumber;
                                                return <option key={pay._id} value={pay._id}>{pay.type} {display ? `(${display})` : ""}</option>;
                                            })}
                                        </select>
                                    ) : <p>No saved payment methods found.</p>}
                                </div>

                                <div className="checkout-summary">
                                    <p>Original Total: <b>₹{total.toFixed(2)}</b></p>
                                    <p>Discount: <b>-₹{discount.toFixed(2)}</b></p>
                                    <p className="final-amount">Final Payable: <b>${finalAmount.toFixed(2)}</b></p>
                                    {discount > 0 && <p className="saved-money">🎉 You saved <b>${discount.toFixed(2)}</b>!</p>}
                                </div>

                                <div className="checkout-actions">
                                    <button className="btn btn-success" onClick={handleConfirmOrder}>Pay & Confirm</button>
                                    <button className="btn btn-secondary" onClick={() => setShowCheckout(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;
