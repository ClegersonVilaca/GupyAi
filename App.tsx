
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/history" element={<DashboardPage />} />
        <Route path="/mentoria" element={<DashboardPage />} />
        <Route path="/settings" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
