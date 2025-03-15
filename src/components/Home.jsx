import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import ProfileForm from "./ProfileForm";
import NavBar from "./NavBar";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const checkUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        // If user document doesn't exist, show the profile modal
        if (!userDoc.exists()) {
          setShowProfileModal(true);
        }
      }
    };

    checkUserProfile();
  }, [auth.currentUser]); // Add dependency on auth.currentUser

  useEffect(() => {
    if (user) {
      fetchUserProfile(user);
    }
  }, [user]);

  // Fetch user profile & check if profile is incomplete
  const fetchUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);

      if (!data.skills || !data.experience || !data.availability) {
        setShowProfileModal(true); // Open modal if profile is incomplete
      }
    }
  };

  // Search developers by username or skills
  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", searchQuery));
    const skillsQuery = query(usersRef, where("skills", "array-contains", searchQuery));

    try {
      const usernameResults = await getDocs(usernameQuery);
      const skillsResults = await getDocs(skillsQuery);

      const users = [
        ...usernameResults.docs.map((doc) => doc.data()),
        ...skillsResults.docs.map((doc) => doc.data()),
      ];

      // Remove duplicate results
      const uniqueUsers = Array.from(new Map(users.map((u) => [u.uid, u])).values());
      setSearchResults(uniqueUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setShowProfileModal={setShowProfileModal}
      />

      {/* User Profile Section */}
      {userData && (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-400">@{userData.username}</h3>
          <div className="mt-3 text-gray-300">
            <p><span className="font-bold text-blue-300">🛠 Skills:</span> {userData.skills?.join(", ") || "Not set"}</p>
            <p><span className="font-bold text-green-300">📈 Experience:</span> {userData.experience || "Not set"}</p>
            <p><span className="font-bold text-purple-300">⏳ Availability:</span> {userData.availability || "Not set"}</p>
          </div>
        </div>
      )}

      {/* Search Results Section */}
      <div className="p-6 max-w-3xl mx-auto">
        {searchResults.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {searchResults.map((developer) => (
              <div
                key={developer.uid}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-400 rounded-full h-10 w-10 flex items-center justify-center">
                    👤
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">@{developer.username}</h4>
                    <div className="space-y-2 mt-2 text-gray-300">
                      <p className="flex items-center space-x-2">
                        <span className="text-blue-400">🛠</span>
                        <span>{developer.skills?.join(" · ")}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="text-green-400">📈</span>
                        <span>{developer.experience}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="text-purple-400">⏳</span>
                        <span>{developer.availability}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            🔍 Search for developers by username or skills
          </div>
        )}
      </div>

      {/* Profile Form Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <ProfileForm onComplete={() => setShowProfileModal(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
