import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ProfileForm = () => {
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
          setSkills(data.skills?.join(", ") || "");
          setExperience(data.experience || "");
          setAvailability(data.availability || "");

          if (
            data.username &&
            data.skills &&
            data.experience &&
            data.availability
          ) {
            setIsEditing(false); // Show edit button if details exist
          } else {
            setIsEditing(true); // Force user to enter details if missing
          }
        } else {
          setIsEditing(true); // First-time users must enter details
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
        username,
        skills: skills.split(",").map((s) => s.trim()),
        experience,
        availability,
      },
      { merge: true }
    );

    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-lg shadow-lg max-w-lg mx-auto bg-gray-800 text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Profile</h2>

      {isEditing ? (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Username:</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Skills:</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. React, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Experience:</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-1">Availability:</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Full-time, Part-time"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Save
          </motion.button>
        </>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-lg">
              <strong className="text-blue-400">Username:</strong> {username}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg">
              <strong className="text-blue-400">Skills:</strong> {skills}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg">
              <strong className="text-blue-400">Experience:</strong>{" "}
              {experience}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-lg">
              <strong className="text-blue-400">Availability:</strong>{" "}
              {availability}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Edit Profile
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileForm;
