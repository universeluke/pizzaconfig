import { Routes, Route } from "react-router-dom";
import AuthGate from "./components/AuthGate";
import LoginPage from "./pages/LoginPage";
import BuildPage from "./pages/BuildPage";
import TrackPage from "./pages/TrackPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <AuthGate>
            <BuildPage />
          </AuthGate>
        }
      />
      <Route
        path="/track"
        element={
          <AuthGate>
            <TrackPage />
          </AuthGate>
        }
      />
      <Route
        path="/history"
        element={
          <AuthGate>
            <HistoryPage />
          </AuthGate>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGate>
            <ProfilePage />
          </AuthGate>
        }
      />
    </Routes>
  );
}
