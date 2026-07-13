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

  const isDashboardRoute =
    pathname.startsWith("/jobseeker") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)]">
        <Outlet />  
      </div>
      {!shouldHideFooter && (
        <div className={isDashboardRoute ? "lg:ml-64 lg:max-w-[calc(100%-16rem)]" : ""}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
