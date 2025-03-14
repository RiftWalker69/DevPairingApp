import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ProfileForm = () => {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSkills(data.skills.join(", "));
          setExperience(data.experience);
          setAvailability(data.availability);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        skills: skills.split(",").map((s) => s.trim()),
        experience,
        availability,
      },
      { merge: true }
    );

    alert("Profile updated!");
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="p-8 bg-gray-900 rounded-xl shadow-2xl max-w-lg mx-auto text-white border border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-100 text-center">
        Edit Profile
      </h2>

      <motion.div className="space-y-6" variants={containerVariants}>
        <motion.div variants={inputVariants}>
          <label className="block font-semibold mb-2 text-gray-300">
            Skills:
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g. React, Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block font-semibold mb-2 text-gray-300">
            Experience:
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g. 2 years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block font-semibold mb-2 text-gray-300">
            Availability:
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g. Full-time, Part-time"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </motion.div>

        <motion.button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Save
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileForm;
