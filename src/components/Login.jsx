import React from "react";
import { auth, googleProvider, githubProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";

const Login = () => {
  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      alert("Login Successful!");
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-8 text-blue-400"
      >
        Developer Pairing App
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLogin(googleProvider)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          Sign in with Google
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLogin(githubProvider)}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
        >
          Sign in with GitHub
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
