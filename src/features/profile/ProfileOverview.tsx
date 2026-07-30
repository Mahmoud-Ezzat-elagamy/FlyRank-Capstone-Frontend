import { Link } from "react-router";
import { useProfile } from "./ProfileContext";

export default function ProfileOverview() {
  const { profile } = useProfile();

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <p className="profile-page__eyebrow">Profile</p>
        <h2>Review your account details</h2>
        <p>
          This page shows the current user data for your market account, including
          name, email, password status, and location.
        </p>
      </header>

      <section className="profile-data" aria-label="Profile data">
        <div className="profile-row">
          <span>Name</span>
          <strong>{profile.name}</strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{profile.email}</strong>
        </div>
        <div className="profile-row">
          <span>Password</span>
          <strong>••••••••</strong>
          <small>Hidden for security</small>
        </div>
        <div className="profile-row">
          <span>Location</span>
          <strong>{profile.location}</strong>
        </div>
      </section>

      <div className="profile-page__actions">
        <Link className="profile-button profile-button--primary" to="/profile/edit">
          Edit profile
        </Link>
      </div>
    </section>
  );
}
