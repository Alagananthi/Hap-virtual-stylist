import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';

function ConfirmSignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email from the sign-up page if available
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmation = async (e) => {
    e.preventDefault();
    if (!email || !code) {
        setErrorMessage('Email and confirmation code are required.');
        return;
    }
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      alert('Account confirmed successfully! You can now sign in.');
      navigate('/signin');
    } catch (error) {
      console.error('Error confirming sign up:', error);
      setErrorMessage(error.message || 'Invalid code or error confirming account.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-orange-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We've sent a verification code to your email.
        </p>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleConfirmation} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
              required
            />
          </div>
          
          {/* Verification Code */}
          <div className="relative">
             <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-md transition"
          >
            CONFIRM ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfirmSignUp;