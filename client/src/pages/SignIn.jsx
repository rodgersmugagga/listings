import React from "react"; // Import React library to use React features like state and JSX
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate hook to programmatically navigate
import { useDispatch, useSelector } from "react-redux"; // Import hooks to interact with Redux store
import { Helmet } from "react-helmet-async"; // Import Helmet for SEO
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"; // Import Redux actions from user slice
import OAuth from "../components/OAuth";
import { validateSignIn } from "../utils/validation";

// Define SignIn component as default export
export default function SignIn() {
  // Local state to store email and password inputs
  const [formData, setFormData] = React.useState({ email: "", password: "" });

  // Local state to store messages (success or error) to show to the user
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState([]);

  // Hook from react-router-dom to navigate programmatically after login
  const navigate = useNavigate();

  // Hook to dispatch actions to Redux store
  const dispatch = useDispatch();

  // Select loading state from Redux store (shows if login request is in progress)
  const { loading } = useSelector((state) => state.user);

  // Handle changes in the input fields
  const handleChange = (e) => {
    // Update the corresponding property in formData using the input's id as the key
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors([]); // Clear errors when user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    
    // Validate form before submission
    const validationErrors = validateSignIn(formData.email, formData.password);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(signInStart()); // Dispatch Redux action indicating login request started
    setMessage("");
    setErrors([]);

    try {
      // Make POST request to backend to authenticate user
      const res = await fetch("/api/auth/signin", {
        method: "POST", // HTTP POST request
        headers: { "Content-Type": "application/json" }, // Tell server we are sending JSON
        body: JSON.stringify(formData), // Convert formData object to JSON string
      });

      const data = await res.json(); // Parse JSON response from server

      if (res.ok) {
        // If login is successful
        dispatch(signInSuccess(data)); // Store user/token in Redux state
        setMessage("✅ Login successful! Redirecting..."); // Set success message to show user
        setTimeout(() => navigate("/"), 1000); // Redirect user to home page
      } else {
        // If login fails
        dispatch(signInFailure(data.message || "Login failed!")); // Store error in Redux
        setErrors([data.message || "Login failed!"]); // Show error message locally
      }
    } catch (error) {
      // Catch network or unexpected errors
      dispatch(signInFailure(error.message)); // Store error in Redux
      setErrors(["Network error: " + error.message]); // Show error message locally
    }
  };

  // Render the component UI
  return (
    <>
      <Helmet>
        <title>Sign In to Rodvers Listings | Login to Your Account</title>
        <meta
          name="description"
          content="Sign in to your Rodvers Listings account. Access your listings, profile, and messages. Secure login for verified users."
        />
        <meta
          name="keywords"
          content="sign in Uganda, login Rodvers, account login, secure login"
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://listings-chvc.onrender.com/sign-in" />
      </Helmet>
      
      <div className="p-6 max-w-lg mx-auto"> {/* Container with padding, max width, and centered */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1> {/* Page title */}

      {/* Show success message if it exists */}
      {message && <p className="text-center text-green-500 mb-4">{message}</p>}

      {/* Show validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Form element with submit handler */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange} // Call handleChange on input change
          required // Make input required
          className="border p-3 rounded-lg"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={handleChange} // Call handleChange on input change
          required // Make input required
          className="border p-3 rounded-lg"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading} // Disable button if login request is in progress
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "Sign In"} {/* Show "Loading..." when request is in progress */}
        </button>

        <OAuth/> {/* OAuth component for third-party authentication */}        

      </form>

      {/* Link to sign-up page */}
      <div className="flex gap-2 justify-center mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      </div>
    </>
  );
}
