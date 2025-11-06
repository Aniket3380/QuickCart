import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./about.css";

const teamMembers = [
    { name: "Sarah Johnson", role: "Product Manager", img: "https://i.pravatar.cc/150?img=1" },
    { name: "David Lee", role: "Lead Developer", img: "https://i.pravatar.cc/150?img=2" },
    { name: "Priya Sharma", role: "UI/UX Designer", img: "https://i.pravatar.cc/150?img=3" },
    { name: "John Doe", role: "Marketing Head", img: "https://i.pravatar.cc/150?img=4" },
];

const About = () => {
    return (
        <div className="about-page">

            {/* Hero Section */}
            <section className="about-hero d-flex align-items-center justify-content-center text-center text-white">
                <div className="container">
                    <h1 className="display-3 fw-bold mb-3">About</h1>
                    <p className="lead mx-auto w-75">
                        Delivering the best online shopping experience — fast, secure, and convenient.
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-5 text-center">
                <div className="container">
                    <h2 className="text-primary fw-bold mb-4">Who We Are</h2>
                    <p className="text-muted fs-5 mx-auto w-75">
                        <strong>QuickCart</strong> is an innovative e-commerce platform designed to make online shopping easier and faster.
                        We offer a wide range of quality products with reliable service and lightning-fast delivery.
                        Our goal is to make every customer’s experience seamless and satisfying.
                    </p>
                </div>
            </section>

            {/* Mission / Vision / Values */}
            <section className="bg-light py-5">
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="card about-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3">🎯</div>
                                <h4 className="fw-bold mb-2">Our Mission</h4>
                                <p className="text-muted">
                                    Simplifying online shopping through trust, innovation, and outstanding customer support.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card about-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3">💡</div>
                                <h4 className="fw-bold mb-2">Our Vision</h4>
                                <p className="text-muted">
                                    To become the most trusted e-commerce platform, empowering customers and local sellers.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card about-card p-4 h-100 shadow-sm border-0">
                                <div className="icon-circle mb-3">❤️</div>
                                <h4 className="fw-bold mb-2">Our Values</h4>
                                <p className="text-muted">
                                    Honesty, customer satisfaction, and a user-centric approach guide everything we do.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-5 bg-white">
                <div className="container text-center">
                    <h2 className="text-primary fw-bold mb-5">Meet Our Team</h2>
                    <div className="row g-4 justify-content-center">
                        {teamMembers.map((member, i) => (
                            <div className="col-10 col-sm-6 col-md-4 col-lg-3" key={i}>
                                <div className="card team-card border-0 shadow-sm p-4 h-100 text-center">
                                    <img src={member.img} alt={member.name} className="team-img rounded-circle mb-3 m-auto" />
                                    <h5 className="fw-bold mb-1">{member.name}</h5>
                                    <p className="text-muted">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
