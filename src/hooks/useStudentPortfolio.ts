import { useEffect, useState } from "react";
import type { AvatarStyle, ExperienceEntry, NoteEntry, ProfileInfo, ProjectEntry } from "@/data/profile";
import { loadPortfolio, profileKey } from "@/utils/profileStorage";
import { getSession, startSession } from "@/utils/session";

export function useStudentPortfolio() {
  const [profile, setProfile] = useState(() => loadPortfolio(getSession()));
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(profileKey(profile.info.name), JSON.stringify(profile));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [profile]);

  const saveInfo = (info: ProfileInfo) => {
    startSession({ name: info.name, branch: info.branch, year: info.year });
    setProfile((current) => ({ ...current, info }));
  };

  return {
    profile, storageAvailable, saveInfo,
    cycleAvatar: () => setProfile((p) => ({ ...p, avatar: (p.avatar + 1) % 3 as AvatarStyle })),
    addProject: (entry: ProjectEntry) => setProfile((p) => ({ ...p, addedProjects: [entry, ...p.addedProjects] })),
    addExperience: (entry: ExperienceEntry) => setProfile((p) => ({ ...p, addedExperience: [entry, ...p.addedExperience] })),
    addNote: (entry: NoteEntry) => setProfile((p) => ({ ...p, addedNotes: [entry, ...p.addedNotes] })),
    saveRepository: (id: string, url: string) => setProfile((p) => ({ ...p, projectLinks: { ...p.projectLinks, [id]: url } })),
  };
}

export type PortfolioStore = ReturnType<typeof useStudentPortfolio>;