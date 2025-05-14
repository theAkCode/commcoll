"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);

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
        bio: "No bio yet",
        skills: "No skills added",
      });
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile</h2>

        {session?.user?.image && (
          <img src={session.user.image} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        )}

        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-gray-500">{profile.email}</p>
        <p className="mt-4">{profile.bio}</p>
        <p className="text-sm text-gray-500">Skills: {profile.skills}</p>

        <button
          onClick={() => router.push("/profile/edit")}
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
