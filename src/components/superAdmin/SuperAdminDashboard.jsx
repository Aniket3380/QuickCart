import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./superAdminDashboard.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const SuperAdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [orderHistory, setOrderHistory] = useState({});
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Fetch Dashboard Summary
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${BASE_URL}/api/superadmin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Failed to load dashboard");
                }

                const dashboardData = await res.json();
                setData(dashboardData);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getProfilePicture = (url) => url || "https://via.placeholder.com/50";
    const changeRole = async (id, newRole) => {
        if (!window.confirm(`Change role to ${newRole}?`)) return;
        setUpdatingId(id);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/users/${id}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role: newRole }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            toast.success("Role updated successfully");

            setData((prev) => {
                // find the user/admin in both arrays
                const user = prev.allUsers.find((u) => u._id === id);
                const admin = prev.allAdmins.find((a) => a._id === id);

                let newAllUsers = [...prev.allUsers];
                let newAllAdmins = [...prev.allAdmins];

                if (newRole === "admin") {
                    // move from users → admins
                    if (user) {
                        newAllUsers = newAllUsers.filter((u) => u._id !== id);
                        newAllAdmins = [...newAllAdmins, { ...user, role: "admin" }];
                    }
                } else if (newRole === "user") {
                    // move from admins → users
                    if (admin) {
                        newAllAdmins = newAllAdmins.filter((a) => a._id !== id);
                        newAllUsers = [...newAllUsers, { ...admin, role: "user" }];
                    }
                }

                return {
                    ...prev,
                    allUsers: newAllUsers,
                    allAdmins: newAllAdmins,
                };
            });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // 🗑 Delete User/Admin
    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user/admin?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete user");
            }

            toast.success("User/Admin deleted successfully");

            // Update local state
            setData((prev) => ({
                ...prev,
                allUsers: prev.allUsers.filter((u) => u._id !== id),
                allAdmins: prev.allAdmins.filter((a) => a._id !== id),
            }));
        } catch (err) {
            toast.error(err.message);
        }
    };

    //  Fetch Order History when expanded
    const toggleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        setExpandedId(id);

        // fetch order history only if not already loaded
        if (!orderHistory[id]) {
            try {
                setLoadingOrders(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`${BASE_URL}/api/orders/history/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await res.json();
                if (!res.ok) throw new Error(result.message || "Failed to fetch orders");

                // handle both {orders: []} or []
                const orders = Array.isArray(result) ? result : result.orders || [];

                setOrderHistory((prev) => ({ ...prev, [id]: orders }));
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoadingOrders(false);
            }
        }
    };

    if (loading) return <p>Loading Super Admin Dashboard...</p>;
    if (!data) return <p>Unable to load dashboard</p>;

    const { superAdmin, stats, allAdmins, allUsers, recentOrders } = data;

    const filteredUsers = allUsers.filter(
        (u) =>
            u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAdmins = allAdmins.filter(
        (a) =>
            a.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //  Render Orders Helper
    const renderOrders = (orders) => {
        if (loadingOrders) return <p>Fetching orders...</p>;
        if (!orders || orders.length === 0) return <p>No orders found.</p>;

        return (
            <ul className="order-history-list">
                {orders.map((order) => (
                    <li key={order._id}>
                        <strong>Order #{order._id}</strong> — ₹{order.total} via {order.paymentMethod} <br />
                        <small>{new Date(order.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="super-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <h2> Super Admin Dashboard</h2>
                <div className="super-profile">
                    <img src={getProfilePicture(superAdmin.profilePicture)} alt="Super Admin" />
                    <div>
                        <h4>{superAdmin.fullname}</h4>
                        <p>{superAdmin.email}</p>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <section className="stats-section">
                <div className="stat-card">
                    <h3>{stats.totalAdmins}</h3>
                    <p>Total Admins</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalProducts}</h3>
                    <p>Total Products</p>
                </div>
                <div className="stat-card">
                    <h3>₹{stats.totalSales}</h3>
                    <p>Total Sales</p>
                </div>
            </section>

            {/*  Admin Management */}
            <section className="user-management">
                <h3>Admin Management</h3>
                <input
                    type="text"
                    placeholder="Search admins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredAdmins.length === 0 ? (
                    <p className="not-found">No admins found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((a) => (
                                <React.Fragment key={a._id}>
                                    <tr
                                        onClick={() => toggleExpand(a._id)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: expandedId === a._id ? "#f5f5f5" : "transparent",
                                        }}
                                    >
                                        <td>
                                            <img src={getProfilePicture(a.profilePicture)} className="avatar" />
                                        </td>
                                        <td>{a.fullname}</td>
                                        <td>{a.email}</td>
                                        <td>{a.role}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeRole(a._id, "user");
                                                }}
                                            >
                                                Remove Admin
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteUser(a._id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === a._id && (
                                        <tr className="expand-row">
                                            <td colSpan="5">{renderOrders(orderHistory[a._id])}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/*  User Management */}
            <section className="user-management">
                <h3>User Management</h3>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredUsers.length === 0 ? (
                    <p className="not-found">No users found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Recent Orders</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <React.Fragment key={u._id}>
                                    <tr
                                        onClick={() => toggleExpand(u._id)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: expandedId === u._id ? "#f5f5f5" : "transparent",
                                        }}
                                    >
                                        <td>
                                            <img src={getProfilePicture(u.profilePicture)} className="avatar" />
                                        </td>
                                        <td>{u.fullname}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            {u.orders?.length ? (
                                                <ul className="order-list">
                                                    {u.orders.slice(-3).map((o) => (
                                                        <li key={o._id}>₹{o.total} ({o.paymentMethod})</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No Orders</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeRole(u._id, "admin");
                                                }}
                                            >
                                                Make Admin
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteUser(u._id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === u._id && (
                                        <tr className="expand-row">
                                            <td colSpan="6">{renderOrders(orderHistory[u._id])}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/*  Recent Orders */}
            <section className="recent-orders">
                <h3>All Recent Orders</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Total</th>
                            <th>Method</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((o) => (
                            <tr key={o._id}>
                                <td>{o.userId?.fullname || "N/A"}</td>
                                <td>₹{o.total}</td>
                                <td>{o.paymentMethod}</td>
                                <td>{new Date(o.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
