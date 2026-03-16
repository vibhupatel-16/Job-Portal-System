import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotAuthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this page.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
