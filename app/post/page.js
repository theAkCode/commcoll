"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function MyPosts() {
  const { data: session, status } = useSession();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsByProject, setRequestsByProject] = useState({});

  const fetchMyProjects = async () => {
    if (!session) return;

    const snapshot = await getDocs(collection(db, "projects"));
    const allProjects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const userProjects = allProjects.filter(
      (project) => project.email === session.user.email
    );
    setMyProjects(userProjects);
    setLoading(false);

    const newRequests = {};
    for (let project of userProjects) {
      const groupRef = doc(db, "groups", project.id);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        newRequests[project.id] = groupSnap.data().requests || [];
      }
    }
    setRequestsByProject(newRequests);
  };

  const acceptRequest = async (projectId, user) => {
    const groupRef = doc(db, "groups", projectId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) return;

    const groupData = groupSnap.data();
    const updatedRequests = (groupData.requests || []).filter(
      (r) => r.email !== user.email
    );
    const updatedMembers = [...(groupData.members || []), user];

    await updateDoc(groupRef, {
      requests: updatedRequests,
      members: updatedMembers,
    });

    alert(`${user.name} has been accepted.`);
    fetchMyProjects();
  };

  const rejectRequest = async (projectId, user) => {
    const groupRef = doc(db, "groups", projectId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) return;

    const groupData = groupSnap.data();
    const updatedRequests = (groupData.requests || []).filter(
      (r) => r.email !== user.email
    );

    await updateDoc(groupRef, {
      requests: updatedRequests,
    });

    alert(`${user.name} has been rejected.`);
    fetchMyProjects();
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      await deleteDoc(doc(db, "groups", projectId)); // 💥 delete group too
      setMyProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Error deleting project and group:", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMyProjects();
    }
  }, [session]);

  if (status === "loading") return <p className="p-4">Loading...</p>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4">
        <p className="mb-2">Please sign in to view your posts.</p>
        <button
          onClick={() => signIn()}
          className="bg-[#8e6a1a] cursor-pointer text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>

      {loading ? (
        <p>Loading your projects...</p>
      ) : myProjects.length === 0 ? (
        <p>You haven’t posted any projects yet.</p>
      ) : (
        <div className="space-y-4">
          {myProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <h3 className="text-lg font-bold">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tech Stack: {project.tech}
              </p>

              <button
                onClick={() => handleDelete(project.id)}
                className="mt-2 bg-[#8e6a1a] cursor-pointer text-white px-3 py-1 rounded"
              >
                Remove Project
              </button>

              {requestsByProject[project.id] &&
                requestsByProject[project.id].length > 0 && (
                  <div className="mt-4 border-t pt-2">
                    <p className="font-semibold mb-2">
                      Collaboration Requests:
                    </p>
                    {requestsByProject[project.id].map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2"
                      >
                        <div>
                          <p>{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptRequest(project.id, user)}
                            className="bg-[#8e6a1a] cursor-pointer text-white px-3 py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectRequest(project.id, user)}
                            className="bg-[#8e6a1a] cursor-pointer text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
