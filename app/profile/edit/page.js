"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function EditProfile() {
  const { data: session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    if (!session) {
      router.push("/"); // Redirect if not logged in
    } else {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.email) return;
    const userDoc = await getDoc(doc(db, "users", session.user.email));
    if (userDoc.exists()) {
      setProfile(userDoc.data());
    } else {
      setProfile({
        name: session.user.name,
        email: session.user.email,
        bio: "",
        skills: "",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.email) return;

    await setDoc(doc(db, "users", session.user.email), profile);
    alert("Profile updated successfully!");

    // Redirect to profile view after saving
    router.push("/profile");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Skills</label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
