import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./components/Login";
import ProfileForm from "./components/ProfileForm";
import { motion } from "framer-motion";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

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
    <div className="min-h-screen bg-gray-900 text-white">
      {user ? (
        <motion.div
          className="p-8 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-100">
            Welcome, {user.displayName || "User"}!
          </h2>
          <ProfileForm />
          <motion.button
            onClick={() => signOut(auth)}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all mt-6"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Logout
          </motion.button>
        </motion.div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
