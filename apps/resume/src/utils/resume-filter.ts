import { Experience, Education, Activity, SideProject } from "../service";

export function filterExperienceForCompact(experience: Experience): Experience {
  return {
    ...experience,
    sections: experience.sections?.map((section) => ({
      ...section,
      bullets: section.bullets.slice(0, 3).map((bullet) => ({
        ...bullet,
        children: bullet.children?.slice(0, 2).map((child) => ({
          ...child,
          children: undefined,
          portfolioLinks: undefined,
          tags: child.tags?.slice(0, 2),
        })),
        portfolioLinks: undefined,
        tags: bullet.tags?.slice(0, 2),
      })),
      portfolioLinks: undefined,
    })),
    bullets: experience.bullets?.slice(0, 3).map((bullet) => ({
      ...bullet,
      children: bullet.children?.slice(0, 2).map((child) => ({
        ...child,
        children: child.children?.slice(0, 2).map((grandChild) => ({
          ...grandChild,
          children: undefined,
          portfolioLinks: undefined,
        })),
        portfolioLinks: undefined,
      })),
      portfolioLinks: undefined,
      tags: bullet.tags?.slice(0, 3),
    })),
  };
}

export function filterEducationForCompact(education: Education): Education {
  return {
    ...education,
    note: undefined,
  };
}

export function filterSideProjectForCompact(
  sideProject: SideProject,
): SideProject {
  return {
    ...sideProject,
    bullets: sideProject.bullets.slice(0, 2).map((bullet) => ({
      ...bullet,
      children: undefined,
      portfolioLinks: undefined,
      tags: bullet.tags?.slice(0, 2),
    })),
    portfolioLinks: undefined,
  };
}

export function filterActivityForCompact(activity: Activity): Activity {
  return {
    ...activity,
    bullets: activity.bullets.slice(0, 2),
  };
}

export function filterSkillsForCompact(skills: string[]): string[] {
  return skills.slice(0, 12);
}
