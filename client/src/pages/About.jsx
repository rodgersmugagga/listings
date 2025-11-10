import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        <title>About Rodvers Tech Ltd - Rodgers Mugagga, CEO & Founder</title>
        <meta
          name="description"
          content="Learn about Rodvers Tech Ltd, founded by Rodgers Mugagga, CEO & Founder. We empower Africa with digital solutions including Rodvers Listings and Mangu Mangu."
        />
        <meta
          name="keywords"
          content="Rodgers Mugagga, CEO, Founder, Rodvers Tech Ltd, Rodvers Listings, Mangu Mangu, digital solutions Uganda, African technology, tech startup"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Rodvers Tech Ltd",
            "url": "https://yourwebsite.com",
            "logo": "https://yourwebsite.com/logo.png",
            "founder": {
              "@type": "Person",
              "name": "Rodgers Mugagga",
              "jobTitle": "CEO & Founder",
              "email": "rodgersmugagga68@gmail.com"
            },
            "sameAs": [
              "https://www.linkedin.com/in/rodgersmugagga",
              "https://twitter.com/rodgersmugagga"
            ]
          })}
        </script>
      </Helmet>

      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", color: "#1a1a1a", marginBottom: "20px" }}>
          About Rodvers Tech Ltd
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: "1.8", marginBottom: "40px" }}>
          Founded by <strong>Rodgers Mugagga</strong>, <em>CEO & Founder</em>, Rodvers Tech Ltd is on a mission to <strong>empower Africa through innovative digital solutions</strong>. 
          We design intelligent, scalable, and practical technology that transforms how businesses, governments, and communities operate across Uganda and Africa.
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          Our Mission
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          We create <strong>user-focused software and technology solutions</strong> that solve real-world problems, improve efficiency, and foster inclusive growth across African industries.
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          Our Products
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          Our flagship platform, <strong>Rodvers Listings</strong>, connects buyers and sellers throughout Uganda. 
          With <strong>Mangu Mangu</strong>, posting, browsing, and selling items is fast, secure, and highly localized — making it the most trusted marketplace for everyday transactions.
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          Why Choose Rodvers Tech Ltd?
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          We deliver <strong>secure, scalable, and user-friendly solutions</strong> designed for African contexts while meeting global standards. 
          Our expertise in both software and hardware ensures seamless experiences, empowering businesses and individuals to thrive confidently.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#1a73e8", marginBottom: "10px" }}>
          Explore <strong>Rodvers Listings</strong>:{" "}
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
          Contact our founder: <a href="mailto:rodgersmugagga68@gmail.com" style={{ color: "#888" }}>rodgersmugagga68@gmail.com</a>
        </p>
      </div>
    </section>
  );
};

export default About;
