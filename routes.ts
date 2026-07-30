import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("profile", "./src/features/profile/ProfileOverview.tsx"),
  route("profile/edit", "./src/features/profile/ProfileEdit.tsx"),
] satisfies RouteConfig;
