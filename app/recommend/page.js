'use client';

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function RecommendPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [groups, setGroups] = useState({});

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    const projectList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        tech: Array.isArray(data.tech)
          ? data.tech
          : data.tech?.split(",").map(s => s.trim()) || []
      };
    });
    setProjects(projectList);

    const groupSnap = await getDocs(collection(db, "groups"));
    const groupMap = {};
    groupSnap.forEach(doc => {
      groupMap[doc.id] = doc.data();
    });
    setGroups(groupMap);
  };

  const recommendProjects = (userSkills, allProjects) => {
    const recommendations = [];
    for (const project of allProjects) {
      const projectSkills = project.tech.map((skill) => skill.toLowerCase());
      const matchCount = userSkills.filter((s) =>
        projectSkills.includes(s.toLowerCase())
      ).length;

      if (matchCount > 0) {
        recommendations.push({ ...project, score: matchCount });
      }
    }
    return recommendations.sort((a, b) => b.score - a.score);
  };

  const handleRecommend = () => {
    const userSkills = skills.split(",").map((s) => s.trim());
    const recommended = recommendProjects(userSkills, projects);
    setRecommendations(recommended);
  };

  const requestToJoinGroup = async (projectId, projectAuthor) => {
    if (!session) return alert("Please sign in");

    const groupRef = doc(db, "groups", projectId);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.exists() ? groupSnap.data() : {};

    const alreadyRequested = (groupData.requests || []).some(
      (r) => r.email === session.user.email
    );
    const alreadyMember = (groupData.members || []).some(
      (m) => m.email === session.user.email
    );

    if (alreadyRequested || alreadyMember || projectAuthor === session.user.email) {
      alert("You're already involved or are the author.");
      return;
    }

    await setDoc(groupRef, {
      ...groupData,
      requests: [
        ...(groupData.requests || []),
        {
          name: session.user.name,
          email: session.user.email,
        },
      ],
    });

    alert("Request sent to join!");
    fetchProjects(); 
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    else if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    else if (diffInHours < 24) return `${diffInHours}h ago`;
    else if (diffInDays < 7) return `${diffInDays}d ago`;
    else if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    else if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    else return `${diffInYears}y ago`;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <h2 className="text-xl font-bold mb-4">Get Project Recommendations</h2>
      <input
        type="text"
        placeholder="Enter skills (comma separated)"
        className="border p-2 w-full mb-4"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <button
        className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleRecommend}
      >
        Recommend Projects
      </button>

      <div className="mt-6 space-y-4">
        {recommendations.length > 0 && (
          <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-700 dark:text-white text-gray-700 text-center p-4 rounded-md shadow-md mb-4">
          <h2 className="text-xl font-semibold">Recommendations</h2>
        </div>
        )}

        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg space-y-4">
            {recommendations.map((proj, index) => {
              const group = groups[proj.id] || {};
              const isAuthor = proj.email === session?.user?.email;
              const isMember = group.members?.some(
                (m) => m.email === session?.user?.email
              );
              const hasRequested = group.requests?.some(
                (r) => r.email === session?.user?.email
              );
              let buttonLabel = "Request to Collaborate";
              let isDisabled = false;

              if (!session) {
                buttonLabel = "Sign in to Collaborate";
                isDisabled = true;
              } else if (isAuthor) {
                buttonLabel = "You are the author";
                isDisabled = true;
              } else if (isMember) {
                buttonLabel = "Already a member";
                isDisabled = true;
              } else if (hasRequested) {
                buttonLabel = "Request Pending";
                isDisabled = true;
              }

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-[20px] border border-gray-200 dark:border-[#5f5f5f] p-6"
                >
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Posted by: {proj.email}
                      </p>
                      {proj.createdAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 m-0.5">
                          {getTimeAgo(proj.createdAt)}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Title:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{proj.title}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Tech Stack:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{proj.tech.join(", ")}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Project Description:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{proj.desc}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Match Score:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{proj.score}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`mt-4 ${isDisabled
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-[#8e6a1a] hover:bg-[#7d5818] dark:bg-[#8e6a1a] dark:hover:bg-[#7d5818] cursor-pointer"
                      } text-white px-4 py-2 rounded-full transition-colors duration-200`}
                    disabled={isDisabled}
                    onClick={() => requestToJoinGroup(proj.id, proj.email)}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
