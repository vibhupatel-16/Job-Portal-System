import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const JobSeekerProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "jobseeker") return <Navigate to="/not-authorized" />;

  return children;
};

export default JobSeekerProtectedRoute;
