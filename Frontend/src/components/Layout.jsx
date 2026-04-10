import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();

  const hideFooterPaths = [
    "/login",
    "/signup",
    "/employer-login",
    "/employer/signup",
    "/forgot-password",
    "/verify-otp",
  ];

  const shouldHideFooter =
    hideFooterPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/reset-password/");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)]">
        <Outlet />  
      </div>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default Layout;
