import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { motion } from "framer-motion";
import ProfileForm from "./ProfileForm";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      checkUserProfile(user);
    }
  }, [user]);

  // Check if user has profile data
  const checkUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (
      !docSnap.exists() ||
      !docSnap.data().skills ||
      !docSnap.data().experience ||
      !docSnap.data().availability
    ) {
      setShowProfileModal(true); // Show profile form if missing data
    }
  };

  // Search users by username or skills
  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", searchQuery));
    const skillsQuery = query(
      usersRef,
      where("skills", "array-contains", searchQuery)
    );

    try {
      const usernameResults = await getDocs(usernameQuery);
      const skillsResults = await getDocs(skillsQuery);

      const users = [
        ...usernameResults.docs.map((doc) => doc.data()),
        ...skillsResults.docs.map((doc) => doc.data()),
      ];

      // Remove duplicates
      const uniqueUsers = Array.from(
        new Map(users.map((u) => [u.uid, u])).values()
      );
      setSearchResults(uniqueUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">{user?.displayName || "User"}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by username or skill"
            className="border rounded px-2 py-1 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-green-500 px-4 py-1 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Search Results */}
      <div className="p-4">
        {searchResults.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user.uid}
                  className="border p-2 rounded mb-2 bg-gray-800"
                >
                  <h4 className="font-semibold">@{user.username}</h4>
                  <p>
                    <strong>Skills:</strong> {user.skills?.join(", ")}
                  </p>
                  <p>
                    <strong>Experience:</strong> {user.experience}
                  </p>
                  <p>
                    <strong>Availability:</strong> {user.availability}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <p className="text-gray-400 mt-4">No users found.</p>
        )}
      </div>

      {/* Profile Form Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <ProfileForm onComplete={() => setShowProfileModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
