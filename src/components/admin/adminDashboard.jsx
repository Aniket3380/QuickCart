import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import { toast } from "react-toastify";
const BASE_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [selectedView, setSelectedView] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to fetch dashboard data");
                }

                const data = await res.json();
                setAdminData(data);
                setLoading(false);
            } catch (err) {
                toast.error(err.message);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getProfilePicture = (url) => url || "https://via.placeholder.com/90";
    const showDetails = (view) => setSelectedView(view);
    // const changeRole = (id, newRole) => alert(`Change role of user ${id} to ${newRole}`);
    const changeRole = async (id, newRole) => {
        const confirmMsg =
            newRole === "admin"
                ? "Are you sure you want to make this user an Admin?"
                : "Are you sure you want to remove Admin privileges for this user?";

        if (!window.confirm(confirmMsg)) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/api/users/${id}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to update role");

            toast.success(`User role updated to "${newRole}" successfully`);

            //  Update UI instantly (no need to refresh)
            setAdminData((prev) => ({
                ...prev,
                allUsers: prev.allUsers.map((user) =>
                    user._id === id ? { ...user, role: newRole } : user
                ),
            }));
        } catch (err) {
            toast.error(err.message);
        }
    };


    if (loading) return <p>Loading dashboard...</p>;
    if (!adminData) return <p>Unable to load dashboard.</p>;

    const { admin, stats, allAdmins, allUsers, recentOrders } = adminData;

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">QuickCart Admin Dashboard</h2>

            {/* Admin Profile */}
            <div className="profile-card">
                <div className="profile-avatar">
                    {admin.profilePicture ? (
                        <img src={getProfilePicture(admin.profilePicture)} alt="Admin Avatar" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="90"
                            height="90"
                            fill="#bbb"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path
                                fillRule="evenodd"
                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                            />
                        </svg>
                    )}
                </div>
                <div className="profile-info">
                    <h3>{admin.fullname}</h3>

                    {/* Email */}
                    <p className="info-item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-envelope-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                        </svg>{" "}
                        {admin.email}
                    </p>

                    {/* Phone */}
                    <p className="info-item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-telephone-forward-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zm10.761.135a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L14.293 4H9.5a.5.5 0 0 1 0-1h4.793l-1.647-1.646a.5.5 0 0 1 0-.708"
                            />
                        </svg>{" "}
                        {admin.phone || "N/A"}
                    </p>

                    {/* Role */}
                    <p className="info-item">
                        Role: <span className="role-badge">Admin</span>
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-grid">
                <div className="stat-card stat-admin" onClick={() => showDetails("admins")}>
                    <i className="bi bi-shield-lock icon"></i>
                    <div>
                        <h4>{stats.totalAdmins}</h4>
                        <p>Total Admins</p>
                    </div>
                </div>
                <div className="stat-card stat-users" onClick={() => showDetails("users")}>
                    <i className="bi bi-people icon"></i>
                    <div>
                        <h4>{stats.totalUsers}</h4>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card stat-products">
                    <i className="bi bi-box-seam icon"></i>
                    <div>
                        <h4>{stats.totalProducts}</h4>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="stat-card stat-sales">
                    <i className="bi bi-cart4 icon"></i>
                    <div>
                        <h4>₹ {stats.totalSales} </h4>
                        <p>Total Sales</p>
                    </div>
                </div>
            </div>

            {/* Admins / Users Lists */}
            {selectedView === "admins" && (
                <div className="list-container">
                    <h3>All Admins</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAdmins.map((a) => (
                                <tr key={a._id}>
                                    {/* <td><img src={getProfilePicture(a.profilePicture)} className="mini-avatar" /></td> */}
                                    <td>
                                        {a.profilePicture ? (
                                            <img
                                                src={getProfilePicture(a.profilePicture)}
                                                className="mini-avatar"
                                                alt={a.fullname}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                fill="#bbb"
                                                className="bi bi-person-circle"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                                />
                                            </svg>
                                        )}
                                    </td>
                                    <td>{a.fullname}</td>
                                    <td>{a.email}</td>
                                    <td>{a.phone || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedView === "users" && (
                <div className="list-container">
                    <h3>All Users</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        {u.profilePicture ? (
                                            <img
                                                src={getProfilePicture(u.profilePicture)}
                                                className="mini-avatar"
                                                alt={u.fullname}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                fill="#bbb"
                                                className="bi bi-person-circle"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                                />
                                            </svg>
                                        )}
                                    </td>
                                    <td>{u.fullname}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || "N/A"}</td>
                                    <td>
                                        <span
                                            className={`badge ${u.role === "admin" ? "bg-primary text-white" : "bg-secondary text-white"
                                                }`}
                                        >
                                            {u.role || "N/A"}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== "admin" ? (
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => changeRole(u._id, "admin")}
                                            >
                                                Make Admin
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => changeRole(u._id, "user")}
                                            >
                                                Remove Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Recent Orders */}
            <div className="list-container">
                <h3>Recent Orders</h3>
                {recentOrders.length === 0 ? (
                    <p className="text-center text-muted">No records found</p>
                ) : (
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
                                    {/* <td>{o.userId.fullname}</td> */}
                                    <td>{o.userId?.fullname || "Unknown User"}</td>
                                    <td>₹{o.total}</td>
                                    <td>{o.paymentMethod}</td>
                                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
