"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([
    { id: 1, title: "AI Chatbot", tech: "Python, TensorFlow", author: "John Doe" },
    { id: 2, title: "Web3 Dapp", tech: "Solidity, Next.js", author: "Jane Smith" },
  ]);
  const [newProject, setNewProject] = useState({ title: "", tech: "" });

  const handlePostProject = () => {
    if (newProject.title && newProject.tech && session) {
      setProjects([...projects, { id: projects.length + 1, title: newProject.title, tech: newProject.tech, author: session.user.name }]);
      setNewProject({ title: "", tech: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4">
      <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-xl font-bold">Project Collaboration Platform</h1>
        <div className="flex gap-4">
          {session ? (
            <>
              <Link href="/profile">
                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                  Profile
                </button>
              </Link>
              <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="mt-4">
        {session && (
          <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Post a New Project</h2>
            <input 
              type="text" 
              placeholder="Project Title" 
              className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="Tech Stack" 
              className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600"
              value={newProject.tech}
              onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
            />
            <button 
              onClick={handlePostProject} 
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
              Post Project
            </button>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2">Available Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-bold">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">Tech Stack: {project.tech}</p>
              <p className="text-gray-500 dark:text-gray-300">Posted by: {project.author}</p>
              <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded">
                Show Interest
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
