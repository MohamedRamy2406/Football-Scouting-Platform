import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage.jsx';
import PlayerProfile from './pages/PlayerProfile.jsx';
import ScoutProfile from './pages/ScoutProfile.jsx';

import ProtectedRoute from './components/common/protectedRoute.jsx';
function App() {
  return (
    <Routes>

      {/* Authentication */}
      <Route path="/" element={<AuthPage />} />

      {/* Player-only page */}
      <Route
        path="/player"
        element={
          <ProtectedRoute allowedRole="PLAYER">
            <PlayerProfile />
          </ProtectedRoute>
        }
      />

      {/* Scout-only page */}
      <Route
        path="/scout"
        element={
          <ProtectedRoute allowedRole="SCOUT">
            <ScoutProfile />
          </ProtectedRoute>
        }
      />

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;

