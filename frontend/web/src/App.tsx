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
import Analytics from "./pages/analytics";
import Contracts from "./pages/contracts";
import Manage from "./pages/manage";
import Invitations from "./pages/invitations";
import Resources from "./pages/resources";

// Define your route configurations
const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/", component: Landing },
  { path: "/register", component: Register },
  { path: "/register/admin", component: RegisterAdmin },
  { path: "/register/tenant", component: RegisterTenant },
];

const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/properties", component: Properties },
  { path: "/property/:id", component: Property },
  { path: "/tickets", component: Tickets },
  { path: "/analytics", component: Analytics },
  { path: "/contracts", component: Contracts },
  { path: "/manage", component: Manage },
  { path: "/invitations", component: Invitations },
  { path: "/resources", component: Resources },
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
