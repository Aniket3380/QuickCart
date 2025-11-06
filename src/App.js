import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/common/Header/header";
import MainContent from "./components/MainContent/mainContent";
import Footer from "./components/common/Footer/footer";
import SignUpLogin from "./components/SignUp_Login/signup_login";
import { AuthProvider } from "./service/AuthContext";
import { CartProvider } from "./service/CartContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminDashboard from "./components/admin/adminDashboard";
import UserProfile from "./components/user/UserProfile";
import Cart from "./components/cart/cartComponent";
import { ProductProvider } from "./service/ProductContext";
import Contact from "./components/contact/contact";
import About from "./components/about/about";
import SuperAdminDashboard from "./components/superAdmin/SuperAdminDashboard";
import ProductNotifications from "./components/ProductNotifications/ProductNotifications";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/auth");
  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};
function App() {
  return (
    <AuthProvider>
      <ProductProvider > {/* Wrap here */}
        <CartProvider>
          <Router>
            <ProductNotifications />
            <Layout>
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth/*" element={<SignUpLogin />} />
                <Route
                  path="/superadmin/dashboard"
                  element={
                    <ProtectedRoute roles={["superadmin"]}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />  <Route
                  path="/superadmin/profile"
                  element={
                    <ProtectedRoute roles={["superadmin"]}>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute roles={["admin"]}><UserProfile /></ProtectedRoute>} />
                {/* User routes */}
                <Route path="/user/profile" element={<ProtectedRoute roles={["user"]}><UserProfile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ProductProvider >
    </AuthProvider>
  );
}

export default App;