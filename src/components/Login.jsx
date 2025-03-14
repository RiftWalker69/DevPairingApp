import React from "react";
import { auth, googleProvider, githubProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { saveUserToFirestore } from "../utlis/userSystem";
import { motion } from "framer-motion";

const Login = () => {
  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user details to Firestore
      await saveUserToFirestore(user);

      alert("Login Successful!");
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 text-center border border-gray-700"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-100">
          Developer Pairing App
        </h2>

        <motion.button
          onClick={() => handleLogin(googleProvider)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all mb-4 flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <img
            src="data:image/png;base64,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"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </motion.button>

        <motion.button
          onClick={() => handleLogin(githubProvider)}
          className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="w-5 h-5 mr-2"
          />
          Sign in with GitHub
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Login;
