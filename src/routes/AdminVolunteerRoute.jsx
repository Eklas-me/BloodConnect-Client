import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminVolunteerRoute = ({ children }) => {
  const { user, loading, isAdmin, isVolunteer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isVolunteer)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminVolunteerRoute;
