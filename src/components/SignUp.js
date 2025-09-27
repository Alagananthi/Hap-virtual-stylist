import React ,{ useState }  from "react";
import { Link } from "react-router-dom";

// --- Helper Components (Icons & Input) ---

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
   className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 peer-focus:animate-bounce"
>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
   className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 peer-focus:animate-bounce"
>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 peer-focus:animate-bounce"
>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const FormInput = ({ icon, type, placeholder }) => (
  <div className="relative w-full mb-6">
    {icon}
    <input
      type={type}
      placeholder={placeholder}
       className="peer w-full pl-12 pr-4 py-3 bg-white/30 border border-gray-300 rounded-lg 
             text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 
             focus:ring-pink-300 transition-all duration-300"
    />
  </div>
);

// --- Main SignUp Component ---

function SignUp() {
  return (
    <div className="w-full px-10 animate-fade-in transition-all duration-700">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-2 animate-pulse">
        Create Account
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Let's get you started with your personal stylist.
      </p>
      <form className="animate-fade-in">
        <FormInput icon={<UserIcon />} type="text" placeholder="Full Name" />
        <FormInput icon={<MailIcon />} type="email" placeholder="Email Address" />
        <FormInput icon={<LockIcon />} type="password" placeholder="Password" />

       <button
  className="relative w-full bg-gradient-to-r from-pink-400 to-rose-400 
             text-white font-bold py-3 rounded-lg shadow-md overflow-hidden group">
  <span className="relative z-10">SIGN UP</span>
  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                   translate-x-[-100%] group-hover:translate-x-[100%] 
                   transition-transform duration-700 ease-out"></span>
</button>

        {/* Link to Sign In */}
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-pink-500 font-semibold hover:underline hover:text-pink-600 
                       transition-colors duration-300"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
export default SignUp;