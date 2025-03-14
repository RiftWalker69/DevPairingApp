import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = async () => {
    if (username.trim() === "") return;

    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setUserData(querySnapshot.docs[0].data());
    } else {
      alert("User not found!");
      setUserData(null);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Search User</h2>
      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
      >
        Search
      </button>

      {userData && (
        <div className="mt-4 p-3 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">{userData.name}</h3>
          <p className="text-gray-600">@{userData.username}</p>
          <p>
            <strong>Skills:</strong> {userData.skills.join(", ")}
          </p>
          <p>
            <strong>Experience:</strong> {userData.experience}
          </p>
          <p>
            <strong>Availability:</strong> {userData.availability}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
