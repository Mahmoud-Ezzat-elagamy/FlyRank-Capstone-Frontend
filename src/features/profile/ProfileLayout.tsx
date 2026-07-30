import { NavLink, Outlet } from "react-router";
import { useProfile } from "./ProfileContext";
import "./Profile.css";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfileLayout() {
  const { profile } = useProfile();

  return (
    <div className="profile-shell">
      <aside className="profile-sidebar" aria-label="Profile navigation">
        <div className="profile-sidebar__identity">
          <div className="profile-sidebar__avatar" aria-hidden="true">
            {getInitials(profile.name)}
          </div>
          <div>
            <p className="profile-sidebar__eyebrow">Account center</p>
            <h1>{profile.name}</h1>
            <p>{profile.email}</p>
          </div>
        </div>

        <nav className="profile-sidebar__nav">
          <NavLink to="/profile" end>
            Profile
          </NavLink>
          <NavLink to="/profile/edit">Edit profile</NavLink>
        </nav>
      </aside>

      <main className="profile-main">
        <Outlet />
      </main>
    </div>
  );
}
