import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section
      id="about"
      style={{
        padding: "80px 20px",
        backgroundColor: "#f4f6f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "3rem", color: "#1a1a1a", marginBottom: "20px" }}>
          About Rodvers Tech Ltd
        </h2>
        <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: "1.8", marginBottom: "40px" }}>
          Founded by <strong>Rodgers Mugagga</strong>, <em>CEO & Founder</em>, Rodvers Tech Ltd is on a mission to <strong>empower Africa through digital innovation</strong>. 
          We build intelligent, scalable, and practical solutions that transform the way businesses, governments, and communities operate.
        </p>

        <h3 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>Our Mission</h3>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          We create <strong>user-focused technology</strong> that solves real-world challenges, drives efficiency, and fosters inclusive growth across Africa’s dynamic industries.
        </p>

        <h3 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>Our Products</h3>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          Our flagship platform, <strong>Rodvers Listings</strong>, connects buyers and sellers across Uganda and beyond. 
          With <strong>Mangu Mangu</strong>, posting, browsing, and selling items is fast, secure, and highly local-friendly — 
          making it the most trusted marketplace for everyday transactions.
        </p>

        <h3 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>Why Choose Us?</h3>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          We deliver <strong>secure, scalable, and user-friendly solutions</strong> built for African contexts, yet meeting global standards. 
          Our integrated software and hardware expertise ensures seamless experiences, empowering businesses and individuals to thrive confidently.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#1a73e8", marginBottom: "10px" }}>
          Ready to explore Rodvers Listings?{" "}
          <Link 
            to="/" 
            style={{ 
              color: "#1a73e8", 
              textDecoration: "none", 
              fontWeight: "bold", 
              borderBottom: "2px solid #1a73e8" 
            }}
          >
            Visit Listings
          </Link>
        </p>

        <p style={{ fontSize: "0.95rem", color: "#888" }}>
          Contact us: <a href="mailto:rodgersmugagga68@gmail.com" style={{ color: "#888" }}>rodgersmugagga68@gmail.com</a>
        </p>
      </div>
    </section>
  );
};

export default About;
