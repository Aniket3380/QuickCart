import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./contact.css";

const Contact = () => {
    return (
        <div className="contact-page">

            {/* Hero Section */}
            <section className="contact-hero d-flex align-items-center justify-content-center text-center text-white">
                <div className="container py-5">
                    <h1 className="display-3 fw-bold mb-3">Get in Touch</h1>
                    <p className="lead mx-auto w-75">
                        We’re here to help! Reach out to us through the contact methods below.
                    </p>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-5 contact-info-section position-relative">
                <div className="container">
                    <div className="row g-4 justify-content-center text-center">

                        <div className="col-10 col-sm-6 col-md-4">
                            <div className="card contact-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3 bg-primary text-white">📧</div>
                                <h5 className="fw-bold mb-2">Email</h5>
                                <p className="text-muted">contact@example.com</p>
                            </div>
                        </div>

                        <div className="col-10 col-sm-6 col-md-4">
                            <div className="card contact-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3 bg-success text-white">📞</div>
                                <h5 className="fw-bold mb-2">Phone</h5>
                                <p className="text-muted">+91 1234567890</p>
                            </div>
                        </div>

                        <div className="col-10 col-sm-6 col-md-4">
                            <div className="card contact-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3 bg-danger text-white">📍</div>
                                <h5 className="fw-bold mb-2">Address</h5>
                                <p className="text-muted">123 QuickCart Street, Mumbai, India</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="decor-circle decor-circle-1"></div>
                <div className="decor-circle decor-circle-2"></div>
                <div className="decor-circle decor-circle-3"></div>
            </section>

        </div>
    );
};

export default Contact;
