"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

export default function WorkRoom() {
  const { data: session, status } = useSession();
  const [myGroups, setMyGroups] = useState([]);
  const [chatInputs, setChatInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState({ groupId: null, type: null });

  useEffect(() => {
    if (!session) return;

    const unsubscribeFns = [];

    const fetchGroups = async () => {
      const snapshot = await getDocs(collection(db, "groups"));
      const groupPromises = snapshot.docs.map(async (docSnap) => {
        const group = docSnap.data();
        const isMember = group.members?.some(
          (m) => m.email === session.user.email
        );
        if (!isMember) return null;

        const projectSnap = await getDoc(doc(db, "projects", docSnap.id));
        const groupWithProject = {
          id: docSnap.id,
          ...group,
          project: projectSnap.exists() ? projectSnap.data() : {},
        };

        const unsubscribe = onSnapshot(doc(db, "groups", docSnap.id), (snap) => {
          const updatedData = snap.data();
          setMyGroups((prevGroups) =>
            prevGroups.map((g) =>
              g.id === snap.id
                ? { ...g, messages: updatedData.messages || [] }
                : g
            )
          );
        });

        unsubscribeFns.push(unsubscribe);
        return groupWithProject;
      });

      const results = await Promise.all(groupPromises);
      const filtered = results.filter(Boolean);
      setMyGroups(filtered);
      setLoading(false);
    };

    fetchGroups();

    return () => {
      unsubscribeFns.forEach((unsub) => unsub());
    };
  }, [session]);

  const sendMessage = async (groupId) => {
    const message = chatInputs[groupId];
    if (!message?.trim()) return;

    const messageData = {
      sender: session.user.name,
      email: session.user.email,
      content: message.trim(),
      timestamp: Timestamp.now(),
    };

    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      messages: arrayUnion(messageData),
    });

    setChatInputs((prev) => ({ ...prev, [groupId]: "" }));
  };

  if (status === "loading") return <p className="p-4">Loading...</p>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4">
        <p className="mb-2">Please sign in to view your workRooms.</p>
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
      <h1 className="text-2xl font-bold mb-4">My WorkRooms</h1>

      {loading ? (
        <p>Loading WorkRooms...</p>
      ) : myGroups.length === 0 ? (
        <p>You haven’t joined any WorkRooms yet.</p>
      ) : (
        <div className="space-y-8">
          {myGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <h3 className="text-xl font-semibold">
                {group.project?.title || "Unnamed Project"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tech Stack: {group.project?.tech}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setActiveModal({ groupId: group.id, type: "members" })
                  }
                  className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Team Members
                </button>
                <button
                  onClick={() =>
                    setActiveModal({ groupId: group.id, type: "chat" })
                  }
                  className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Chat
                </button>
              </div>

              
              {activeModal.groupId === group.id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
                    <button
                      onClick={() => setActiveModal({ groupId: null, type: null })}
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-xl font-bold cursor-pointer"
                    >
                      ✕
                    </button>

                    {activeModal.type === "members" &&(
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Team Members</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {group.members.map((m, idx) => (
                            <li key={idx}>
                              {m.name} ({m.email})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeModal.type === "chat" &&(
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Group Chat</h4>
                        <div className="max-h-48 overflow-y-auto mb-3 space-y-2 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          {(group.messages || []).map((msg, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded ${
                                msg.email === session.user.email
                                  ? "bg-[#8e6a1a] dark:bg-[#8e6a1a] self-end"
                                  : "bg-gray-200 dark:bg-gray-600"
                              }`}
                            >
                              <strong>{msg.sender}:</strong> {msg.content}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-grow p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                            placeholder="Type your message..."
                            value={chatInputs[group.id] || ""}
                            onChange={(e) =>
                              setChatInputs((prev) => ({
                                ...prev,
                                [group.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") sendMessage(group.id);
                            }}
                          />
                          <button
                            onClick={() => sendMessage(group.id)}
                            className="bg-[#8e6a1a] text-white px-4 py-2 rounded cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
