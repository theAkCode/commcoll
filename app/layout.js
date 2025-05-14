"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <Navbar/>
          {children}
          <Footer/>
        </body>
      </html>
    </SessionProvider>
  );
}
