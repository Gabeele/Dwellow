import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NoPage from "./Pages/NoPage";

import './App.css';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    </>
  );
}

export default App;
