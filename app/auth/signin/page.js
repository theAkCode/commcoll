'use client';
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Welcome back
        </h1>
        <button
          onClick={() => signIn("google", {callbackUrl: "/"})}
          className="w-full bg-[#8e6a1a] cursor-pointer text-white font-semibold py-3 px-2 rounded-full transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.1 0 6.2 1.2 8.5 3.2l6.4-6.4C35.3 2.2 30.14 0 24 0 14.73 0 6.98 5.64 2.73 13.8l7.44 5.8C11.5 13.1 17.17 9.5 24 9.5z"
            />
            <path
              fill="#FBBC05"
              d="M46.5 24.4c0-1.3-.1-2.6-.4-3.8H24v7.1h12.7c-.6 3.4-2.5 6.3-5.3 8.3l7.3 5.7c4.3-4 6.8-9.9 6.8-16.3z"
            />
            <path
              fill="#4285F4"
              d="M11.17 28.3c-1.3-3.8-1.3-7.8 0-11.6l-7.44-5.8C1.03 19 1 22.4 1 24c0 1.6.03 4 .73 7.1l7.44-5.8z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.14 0 11.3-2.06 15.07-5.58l-7.3-5.7c-2.08 1.4-4.73 2.24-7.77 2.24-6.83 0-12.5-3.6-14.6-8.77l-7.44 5.8c4.25 8.2 11.98 13.8 21.04 13.8z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}