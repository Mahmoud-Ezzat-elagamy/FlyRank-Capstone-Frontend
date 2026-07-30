import { createContext, useContext, useState, type ReactNode } from "react";
import { initialProfile } from "./profile.mock";
import type { ProfileData } from "./profile.types";

interface ProfileContextValue {
  profile: ProfileData;
  updateProfile: (profile: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}
