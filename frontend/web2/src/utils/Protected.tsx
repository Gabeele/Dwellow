import React, { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Navigation from "../components/Navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <>
      <Navigation />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
