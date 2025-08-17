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
    designation: "",
    skills: "",
    projects: "",
    education: "",
  });

  useEffect(() => {
    if (!session) {
      router.push("/");
    } else {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
  if (!session?.user?.email) return;
  const userDoc = await getDoc(doc(db, "users", session.user.email));

  if (userDoc.exists()) {
    const data = userDoc.data();
    setProfile({
      name: data.name ?? "",
      email: data.email ?? session.user.email,
      designation: data.designation ?? "",
      skills: data.skills ?? "",
      projects: data.projects ?? "",
      education: data.education ?? "",
    });
  } else {
    setProfile({
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      designation: "",
      skills: "",
      projects: "",
      education: "",
    });
  }
};

  const handleSaveProfile = async () => {
    if (!session?.user?.email) return;

    await setDoc(doc(db, "users", session.user.email), profile);
    alert("Profile updated successfully!");

    
    router.push("/profile");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Edit Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#8e6a1a]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Designation</label>
            <textarea
              value={profile.designation}
              onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#8e6a1a]"
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
            <label className="block text-gray-700 dark:text-gray-300">Tech Skills</label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#8e6a1a]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Past Projects</label>
            <textarea
              value={profile.projects}
              onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#8e6a1a]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Education</label>
            <textarea
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#8e6a1a]"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-[#8e6a1a] cursor-pointer text-white py-3 rounded-lg font-semibold transition-all ease-in-out duration-200"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}