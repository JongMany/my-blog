import {
  Experience,
  Education,
  Activity,
  Bullet,
  SideProject,
  Section,
} from "../service";

// 간단한 버전에서 경력 항목을 필터링하는 함수
export function filterExperienceForCompact(experience: Experience): Experience {
  return {
    ...experience,
    // sections가 있으면 sections를 필터링, 없으면 기존 bullets 필터링
    sections: experience.sections?.map((section) => ({
      ...section,
      bullets: section.bullets.slice(0, 3).map((bullet) => ({
        ...bullet,
        children: bullet.children?.slice(0, 2).map((child) => ({
          ...child,
          children: undefined, // 하위 bullets 제거 (2단계까지만)
          portfolioLinks: undefined, // 포트폴리오 링크 제거
          tags: child.tags?.slice(0, 2), // 태그도 최대 2개로 제한
        })),
        portfolioLinks: undefined, // 포트폴리오 링크 제거
        tags: bullet.tags?.slice(0, 2), // 태그도 최대 2개로 제한
      })),
      portfolioLinks: undefined, // 섹션 레벨 포트폴리오 링크 제거
    })),
    // 기존 bullets 필터링 (sections가 없는 경우를 위해)
    bullets: experience.bullets?.slice(0, 3).map((bullet) => ({
      ...bullet,
      children: bullet.children?.slice(0, 2).map((child) => ({
        ...child,
        children: child.children?.slice(0, 2).map((grandChild) => ({
          ...grandChild,
          children: undefined, // 하위 bullets 제거 (3단계까지만)
          portfolioLinks: undefined, // 하위 bullets의 포트폴리오 링크 제거
        })),
        portfolioLinks: undefined, // 하위 bullets의 포트폴리오 링크 제거
      })),
      portfolioLinks: undefined, // 포트폴리오 링크 제거
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
      portfolioLinks: undefined, // 포트폴리오 링크 제거
      tags: bullet.tags?.slice(0, 2), // 태그도 최대 2개로 제한
    })),
    // summary는 유지 (요약 정보는 중요)
    portfolioLinks: undefined, // 포트폴리오 링크 제거
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
