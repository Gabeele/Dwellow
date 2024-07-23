import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/Protected";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Landing from "./pages/landing";
import Properties from "./pages/properties";
import Property from "./pages/property";
import RegisterAdmin from "./pages/admin";
import RegisterTenant from "./pages/tenant";
import Tickets from "./pages/tickets";
import Contracts from "./pages/contracts";
import Manage from "./pages/manage";
import Invitations from "./pages/invitations";
import Network from "./pages/network";
import Reviews from "./pages/reviews";
import Ticket from "./pages/ticket"

// Define your route configurations
const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/", component: Landing },
  { path: "/register/admin", component: RegisterAdmin },
  { path: "/reviews", component: Reviews },
];

const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/properties", component: Properties },
  { path: "/property/:id", component: Property },
  { path: "/tickets", component: Tickets },
  { path: "/ticket/:id", component: Ticket },
  { path: "/contracts", component: Contracts },
  { path: "/manage", component: Manage },
  { path: "/invitations", component: Invitations },
  { path: "/network", component: Network },
];

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Map public routes */}
        {publicRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Map protected routes */}
        {protectedRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
