import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Import Helmet for SEO
import OAuth from "../components/OAuth";
import { validateSignUp } from "../utils/validation";

export default function SignUp() {
  const [formData, setFormData] = React.useState({ username: "", email: "", password: "" });
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignUp(formData.username, formData.email, formData.password);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrors([]);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! Redirecting to sign in...");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        setErrors([data.message || "Registration failed!"]);
      }
    } catch (error) {
      setErrors(["Network error: " + error.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up for Rodvers Listings | Create Your Account</title>
        <meta
          name="description"
          content="Create a free Rodvers Listings account. Post and manage your listings for real estate, vehicles, electronics and more. Secure signup in Uganda."
        />
        <meta
          name="keywords"
          content="sign up Uganda, create account, free account Rodvers, register listing"
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://listings-chvc.onrender.com/sign-up" />
      </Helmet>
      
      <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

  {message && <p className="text-center text-brand-500 mb-4">{message}</p>}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={handleChange}
          value={formData.username}
          required
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          value={formData.email}
          required
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          value={formData.password}
          required
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <OAuth />
      </form>

      <div className="flex gap-2 justify-center mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-brand-600">Sign in</span>
        </Link>
      </div>
      </div>
    </>
  );
}
