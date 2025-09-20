import {
  Experience,
  Education,
  Activity,
  Bullet,
  SideProject,
} from "../service/resume";

// 간단한 버전에서 경력 항목을 필터링하는 함수
export function filterExperienceForCompact(experience: Experience): Experience {
  return {
    ...experience,
    // 간단한 버전에서는 bullets를 최대 3개로 제한하고, 하위 bullets는 제거
    bullets: experience.bullets.slice(0, 3).map((bullet) => ({
      ...bullet,
      children: undefined, // 하위 bullets 제거
      tags: bullet.tags?.slice(0, 3), // 태그도 최대 3개로 제한
    })),
    // summary는 유지 (요약 정보는 중요)
  };
}

// 간단한 버전에서 교육 항목을 필터링하는 함수
export function filterEducationForCompact(education: Education): Education {
  return {
    ...education,
    // 간단한 버전에서는 note 제거 (부가 정보)
    note: undefined,
  };
}

// 간단한 버전에서 사이드 프로젝트 항목을 필터링하는 함수
export function filterSideProjectForCompact(
  sideProject: SideProject,
): SideProject {
  return {
    ...sideProject,
    // 간단한 버전에서는 bullets를 최대 2개로 제한하고, 하위 bullets는 제거
    bullets: sideProject.bullets.slice(0, 2).map((bullet) => ({
      ...bullet,
      children: undefined, // 하위 bullets 제거
      tags: bullet.tags?.slice(0, 2), // 태그도 최대 2개로 제한
    })),
    // summary는 유지 (요약 정보는 중요)
    // portfolioLinks는 유지 (링크는 중요)
  };
}

// 간단한 버전에서 활동 항목을 필터링하는 함수
export function filterActivityForCompact(activity: Activity): Activity {
  return {
    ...activity,
    // 간단한 버전에서는 bullets를 최대 2개로 제한
    bullets: activity.bullets.slice(0, 2),
  };
}

// 스킬 목록을 간단한 버전으로 필터링하는 함수
export function filterSkillsForCompact(skills: string[]): string[] {
  // 간단한 버전에서는 주요 스킬만 표시 (최대 12개)
  return skills.slice(0, 12);
}

// 간단한 버전에서 불릿 포인트를 축약하는 함수
export function truncateBulletText(
  text: string,
  maxLength: number = 100,
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
