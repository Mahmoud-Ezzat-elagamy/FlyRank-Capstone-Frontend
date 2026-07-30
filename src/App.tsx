import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import UserProfile from "./features/profile/UserProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
