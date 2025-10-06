import React from "react"; // Import React library to use React features
import { Link, useNavigate } from "react-router-dom"; // Import Link component for client-side navigation

// Define the SignIn component as a default export
export default function SignIn() {
  // State to store the form data ( email, password)
  const [formData, setFormData] = React.useState({ email: "", password: "" });

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
      const res = await fetch("/api/auth/signin", {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Specify JSON content type
        body: JSON.stringify(formData), // Convert formData object to JSON string
      });

      const data = await res.json(); // Parse JSON response from backend

      if (res.ok) {
        // If response is successful, show success message
        setMessage("Login successful! Redirecting...");
        navigate("/"); // Redirect to home page after successful registration 
      } else {
        // If response failed, show error message returned by backend or a default message
        setMessage(data.message || "Login failed!");
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
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1> {/* Page title */}

      {/* Display message to user if it exists */}
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}

      {/* Form element with onSubmit event handler */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
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
          {loading ? "Loading..." : "Sign In"} {/* Show loading text if request is in progress */}
        </button>
      </form>

      {/* Link to sign-in page */}
      <div className="flex gap-2 justify-center mt-5">
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
