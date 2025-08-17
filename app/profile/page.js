"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileView() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);

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
      setProfile(userDoc.data());
    } else {
      setProfile({
        name: session.user.name,
        email: session.user.email,
      });
    }
  };

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center w-full max-w-lg mb-6">
          <div className="mb-4">
            
              <div className="w-28 h-28 rounded-full bg-[#b28f1c] flex items-center justify-center text-4xl font-medium text-white">
                {profile.name[0]}
              </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {profile.name}
          </h3>
          <button
            onClick={() => router.push("/profile/edit")}
            className="mt-4 bg-[#8e6a1a] cursor-pointer text-white py-2 px-6 rounded-full transition-all ease-in-out duration-200"
          >
            Edit Profile
          </button>
        </div>

        
        <div className="flex flex-col items-end w-full max-w-lg space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Designation
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{profile.designation}</p>

          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Contact Information
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Tech Skills
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{profile.skills}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Past Projects
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{profile.projects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Education
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{profile.education}</p>
          </div>
        </div>
      </div>
    </div>
  );
}