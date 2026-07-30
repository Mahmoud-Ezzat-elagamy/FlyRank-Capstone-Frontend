import { Link } from "react-router";
import { mockUserProfile } from "./userProfile.mock";
import "./UserProfile.css";

export default function UserProfile() {
  const { name, title, location, bio, stats, highlights, tags } = mockUserProfile;

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-card__shine" aria-hidden="true" />

        <Link className="profile-card__back" to="/">
          Back to home
        </Link>

        <header className="profile-card__header">
          <div className="profile-card__avatar" aria-hidden="true">
            {name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="profile-card__identity">
            <p className="profile-card__eyebrow">User profile</p>
            <h1>{name}</h1>
            <p className="profile-card__title">{title}</p>
            <p className="profile-card__location">{location}</p>
          </div>
        </header>

        <p className="profile-card__bio">{bio}</p>

        <section className="profile-card__stats" aria-label="Profile stats">
          {stats.map((stat) => (
            <article key={stat.label} className="profile-stat">
              <span className="profile-stat__value">{stat.value}</span>
              <span className="profile-stat__label">{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="profile-card__highlights">
          <h2>Highlights</h2>
          <ul>
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <section className="profile-card__tags" aria-label="Interests">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </section>
      </section>
    </main>
  );
}
