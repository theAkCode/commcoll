import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-3 lg:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 <a href="/" className="hover:underline">commcoll™</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center">
            
            
            <a
              href="https://www.linkedin.com"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="LinkedIn"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 448 512"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341a53.79 53.79 0 1 1 53.79-53.78A53.79 53.79 0 0 1 53.79 107zm394.34 341h-92.68V302.4c0-34.7-.7-79.29-48.26-79.29-48.28 0-55.68 37.67-55.68 76.65V448h-92.69V148.9h89.08v40.8h1.3c12.4-23.4 42.6-48.26 87.75-48.26 93.88 0 111.13 61.8 111.13 142.3V448z" />
              </svg>
            </a>
            
            <a
              href="https://www.github.com"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="GitHub"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.234 1.838 1.234 1.07 1.835 2.809 1.304 3.495.997.108-.776.42-1.304.762-1.604-2.665-.3-5.467-1.334-5.467-5.93 0-1.31.465-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.043.138 3.003.404 2.28-1.552 3.283-1.23 3.283-1.23.653 1.653.24 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.625-5.48 5.92.432.372.816 1.102.816 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;