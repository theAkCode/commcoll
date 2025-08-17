import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 bg-gray-100 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white -mt-2">
            commcoll
          </span>
        </Link>

        <div className="flex md:order-2">
          <button
            type="button"
            className="text-white bg-[#8e6a1a] hover:bg-[#74531c] focus:ring-4 focus:outline-none focus:ring-[#8e6a1a] font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Welcome {session?.user?.name || "Guest"}!
          </button>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-100 dark:bg-gray-900 md:dark:bg-gray-900 dark:border-gray-700">
            {[
              { href: '/', label: 'Home' },
              { href: '/post', label: 'Post' },
              { href: '/workroom', label: 'WorkRoom' },
              { href: '/profile', label: 'Profile' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-2 px-3 md:p-0 text-gray-900 dark:text-white rounded-sm hover:bg-[#8e6a1a] md:hover:bg-transparent md:hover:text-[#8e6a1a]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;