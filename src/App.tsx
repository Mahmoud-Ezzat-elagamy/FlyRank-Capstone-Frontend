import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProfileEdit from "./features/profile/ProfileEdit";
import ProfileLayout from "./features/profile/ProfileLayout";
import ProfileOverview from "./features/profile/ProfileOverview";
import { ProfileProvider } from "./features/profile/ProfileContext";

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfileOverview />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
