import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ProfileForm = ({ onComplete }) => {
  const [username, setUsername] = useState("");
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
          setUsername(data.username || "");
          setSkills(data.skills?.join(", ") || "");
          setExperience(data.experience || "");
          setAvailability(data.availability || "");
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
    onComplete(); // Close the modal after saving
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-lg mx-auto bg-white text-black">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <label className="block font-semibold">Skills:</label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="e.g. React, Node.js"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <label className="block font-semibold">Experience:</label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="e.g. 2 years"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />

      <label className="block font-semibold">Availability:</label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="e.g. Full-time, Part-time"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default ProfileForm;
