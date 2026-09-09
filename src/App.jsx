import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import PlayerProfile from './pages/PlayerProfile';
import ScoutProfile from './pages/ScoutProfile';
import ProtectedRoute from './components/protectedRoute';

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

