"use client";

import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div className="flex flex-col items-center bg-dwellow-dark-200 h-full w-64">
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
          <Link to="/dashboard" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Dashboard
          </Link>
          <Link to="/properties" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Properties
          </Link>
          <Link to="/tickets" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Tickets
          </Link>
          <Link to="/analytics" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Analytics
          </Link>
          <Link to="/contracts" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Contracts
          </Link>
          <Link to="/manage" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Manage team
          </Link>
          <Link to="/invitations" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Invitations
          </Link>
          <Link to="/resources" className="text-lg font-normal justify-start text-dwellow-white-200 hover:underline">
            Resources
          </Link>
        </div>
        <div>
          <Link to="" className="text-lg font-normal justify-start text-dwellow-white-200 absolute bottom-9">
            Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
