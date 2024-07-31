"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
import { Button } from "./ui/button";

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
      clearCache();
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  const clearCache = () => {
    localStorage.clear();
  };

  return (
    <div className="flex flex-col h-full w-64 bg-dwellow-dark-200">
      <div className="flex flex-col items-center flex-grow">
        <div className="px-4 py-2 my-6">
          <div className="text-center mb-12">
            <h2 className="px-2 text-2xl font-bold text-dwellow-white-200">
              Dwellow
            </h2>
            <h3 className="text-sm font-medium text-dwellow-white-200">
              Admin Portal
            </h3>
          </div>
          <div className="flex flex-col space-y-7">
            <Link
              to="/dashboard"
              className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/properties"
              className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline"
            >
              Properties
            </Link>
            <Link
              to="/tickets"
              className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline"
            >
              Tickets
            </Link>
            <Link
              to="/contracts"
              className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline"
            >
              Contracts
            </Link>

            <Link
              to="/network"
              className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline"
            >
              Network
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center mb-6 ml-12 -mt-6">
        <Avatar className="text-white">
          <AvatarImage src="/logo-no-text.svg" className="text-white" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <Button
          variant="link"
          onClick={handleLogout}
          className="text-dwellow-white-200 inline-flex"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navigation;
