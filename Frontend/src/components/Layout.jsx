import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-16">
        <Outlet />   {/* ⭐ Yaha pe children pages render honge */}
      </div>

      <Footer />
    </>
  );
};

export default Layout;
