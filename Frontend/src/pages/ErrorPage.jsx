import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error)

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600">404 Not Found</h1>
      <p className="text-gray-600 mt-3">
        Sorry! The page you’re looking for doesn’t exist.
      </p>
      <p className="text-sm text-gray-400 mt-1">{error.statusText || error.message}</p>

      <Link
        to="/"
        className="mt-5 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
