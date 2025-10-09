import React from "react"; // Import React library to use React features
import { Link, useNavigate } from "react-router-dom"; // Import Link component for client-side navigation
import Oauth from "../components/OAuth";
import OAuth from "../components/OAuth";

// Define the SignUp component as a default export
export default function SignUp() {
  // State to store the form data (username, email, password)
  const [formData, setFormData] = React.useState({ username: "", email: "", password: "" });

  // State to store messages to display to the user (success/error)
  const [message, setMessage] = React.useState("");

  // State to track loading status while submitting the form
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate(); // Hook to programmatically navigate to different routes    

  // Function to handle changes in input fields
  const handleChange = (e) => {
    // Update the corresponding property in formData using input's id as key
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true); // Set loading state to true while request is processing
    try {
      // Send POST request to backend API to register the user
      const res = await fetch("/api/auth/signup", {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Specify JSON content type
        body: JSON.stringify(formData), // Convert formData object to JSON string
      });

      const data = await res.json(); // Parse JSON response from backend

      if (res.ok) {
        // If response is successful, show success message
        setMessage("Registration successful! You can now sign in.");
        navigate("/sign-in"); // Redirect to sign-in page after successful registration 
      } else {
        // If response failed, show error message returned by backend or a default message
        setMessage(data.message || "Registration failed!");
      }
    } catch (error) {
      // Handle network or unexpected errors
      setMessage("Error: " + error.message);
    } finally {
      // Reset loading state after request is complete
      setLoading(false);
    }
    
  };

  return (
    <div className="p-6 max-w-lg mx-auto"> {/* Container with padding, max width, and center alignment */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1> {/* Page title */}

      {/* Display message to user if it exists */}
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}

      {/* Form element with onSubmit event handler */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username input field */}
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={handleChange} // Call handleChange on every keystroke
          value={formData.username} // Controlled input bound to state
          required // Make field required
          className="border p-3 rounded-lg"
        />

        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          value={formData.email}
          required
          className="border p-3 rounded-lg"
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          value={formData.password}
          required
          className="border p-3 rounded-lg"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "Signing Up..." : "Sign Up"} {/* Show loading text if request is in progress */}
        </button>

        <OAuth/> {/* OAuth component for third-party authentication */}    

      </form>

      {/* Link to sign-in page */}
      <div className="flex gap-2 justify-center mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
