"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState({});
  const [newProject, setNewProject] = useState({ title: "", tech: "", desc: "" });
  const [showModal, setShowModal] = useState(false);


  const saveUserIfNew = async () => {
    if (!session?.user?.email) return;
    const userRef = doc(db, "users", session.user.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || "",
        joinedAt: Timestamp.now(),
      });
      console.log("✅ New user saved to Firestore");
    } else {
      console.log("ℹ️ User already exists in Firestore");
    }
  };


  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    const projectList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectList);

    const groupsSnapshot = await getDocs(collection(db, "groups"));
    const groupData = {};
    groupsSnapshot.forEach((doc) => {
      groupData[doc.id] = doc.data();
    });
    setGroups(groupData);
  };


  const handlePostProject = async () => {
    if (!newProject.title || !newProject.tech || !newProject.desc || !session) return;

    const newEntry = {
      title: newProject.title,
      tech: newProject.tech,
      desc: newProject.desc,
      author: session.user.name,
      email: session.user.email,
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "projects"), newEntry);
      await setDoc(doc(db, "groups", docRef.id), {
        groupName: newEntry.title,
        projectId: docRef.id,
        projectOwnerEmail: session.user.email,
        members: [
          {
            name: session.user.name,
            email: session.user.email,
          },
        ],
        requests: [],
      });
      setNewProject({ title: "", tech: "", desc: "" });
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };


  const requestToJoinGroup = async (project) => {
    if (!session) return;

    const groupRef = doc(db, "groups", project.id);
    const groupSnap = await getDoc(groupRef);
    const existing = groupSnap.exists() ? groupSnap.data() : {};

    const alreadyRequested = (existing.requests || []).some(
      (r) => r.email === session.user.email
    );
    const alreadyMember = (existing.members || []).some(
      (m) => m.email === session.user.email
    );

    if (alreadyRequested || alreadyMember) {
      alert("You have already requested or are already a member.");
      return;
    }

    await setDoc(groupRef, {
      ...existing,
      requests: [
        ...(existing.requests || []),
        {
          name: session.user.name,
          email: session.user.email,
        },
      ],
    });

    alert("Request sent to join the group!");
    fetchProjects();
  };


  useEffect(() => {
    if (session) {
      saveUserIfNew();
    }
    fetchProjects();
  }, [session]);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4">
      <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-xl font-bold">Project Collaboration Platform</h1>
        <div className="flex gap-4">
          {session ? (
            <>
              <button
                onClick={() => signOut()}
                className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="mt-4">
        <div className="float-right w-full max-w-xs mb-4">
          <div className="bg-white dark:bg-gray-700 dark:text-white text-gray-700 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Know recommended projects as per your skills
            </h3>
            <Link href="/recommend" passHref>
              <div className="bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-600 px-6 py-2 w-full rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition text-center">
                Get suggestions
              </div>
            </Link>
          </div>
        </div>

        {session && (
          <div className="w-full max-w-lg mx-auto mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-white cursor-text dark:bg-gray-800 dark:text-white text-gray-600 text-left p-4 rounded-full shadow-md"
            >
              Start a post
            </button>
          </div>

        )}


        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-2xl cursor-pointer"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Post a New Project</h2>
              <input
                type="text"
                placeholder="Project Title"
                className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tech Stack (comma separated)"
                className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600"
                value={newProject.tech}
                onChange={(e) =>
                  setNewProject({ ...newProject, tech: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Project Description"
                className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600"
                value={newProject.desc}
                onChange={(e) =>
                  setNewProject({ ...newProject, desc: e.target.value })
                }
              />
              <button
                onClick={handlePostProject}
                className="mt-4 bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
              >
                Post Project
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-700 dark:text-white text-gray-700 text-center p-4 rounded-md shadow-md mb-4">
          <h2 className="text-xl font-semibold">Available Projects</h2>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg space-y-4">
            {projects.map((project) => {
              const group = groups[project.id] || {};
              const isAuthor = project.email === session?.user?.email;
              const hasRequested = group.requests?.some(
                (r) => r.email === session?.user?.email
              );
              const isMember = group.members?.some(
                (m) => m.email === session?.user?.email
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
                  key={project.id}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-[20px] border border-gray-200 dark:border-[#5f5f5f] p-6"
                >
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Posted by: {project.author}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 m-0.5">
                        {getTimeAgo(project.createdAt)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Title:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{project.title}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Tech Stack:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{project.tech}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Project Description:</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 my-3 text-xs border border-yellow-200 dark:border-[#74531c] rounded-[20px]">
                        <p>{project.desc}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`mt-4 ${isDisabled
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-[#8e6a1a] hover:bg-[#7d5818] dark:bg-[#8e6a1a] dark:hover:bg-[#7d5818] cursor-pointer"
                      } text-white px-4 py-2 rounded-full transition-colors duration-200`}
                    disabled={isDisabled}
                    onClick={() => requestToJoinGroup(project)}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}