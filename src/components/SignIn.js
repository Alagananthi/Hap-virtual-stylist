import React, { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { signIn , getCurrentUser} from "aws-amplify/auth";

function SignIn({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // If this succeeds, a user is already logged in
        await getCurrentUser();
        console.log("User is already signed in, redirecting to dashboard.");
        setIsAuthenticated(true); // Ensure app state is updated
        navigate("/dashboard");
      } catch (error) {
        // No user is signed in, do nothing.
        console.log("No user signed in.");
      }
    };

    checkAuthStatus();
  }, [navigate, setIsAuthenticated]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // And change this line:
      const { isSignedIn } = await signIn({ username: email, password });
      console.log("Signed in:", isSignedIn);
      if (isSignedIn) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert(error.message || "Error signing in");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-orange-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue your style journey.
        </p>

        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12H8m8-4H8m-2 8h12M4 6h16M4 6l8 6 8-6"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7"
                />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-md transition"
          >
            SIGN IN
          </button>

          <p className="text-center text-gray-700">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
