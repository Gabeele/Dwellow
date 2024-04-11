import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/Protected";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Landing from "./pages/landing";
import Properties from "./pages/properties";
import Property from "./pages/property";

// Define your route configurations
const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/", component: Landing },
];

const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/properties", component: Properties },
  { path: "/property/:id", component: Property },
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
