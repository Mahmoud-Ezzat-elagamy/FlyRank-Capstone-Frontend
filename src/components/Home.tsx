import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <h2>Welcome to the home page</h2>
      <Link to="/profile">Go to profile</Link>
    </div>
  );
}
