import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("profile", "./src/features/profile/UserProfile.tsx"),
] satisfies RouteConfig;
