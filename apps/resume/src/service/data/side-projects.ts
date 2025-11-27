import type { SideProject } from "../types";

export const sideProjects: SideProject[] = [
  {
    title: "[스승의 날 프로젝트]",
    period: "2023.05.11 - 2024.05.14",
    overview:
      "스승의 날의 맞이하여 연구실 내의 인원들이 교수님께 편지를 쓸 수 있도록 웹페이지 형태로 구현하였습니다.",
    tooltipImages: {
      "스승의 날 프로젝트": "/assets/teachers-day-main.png",
    },
    portfolioLinks: [
      {
        title: "스승의 날 프로젝트 포트폴리오",
        url: "https://jongmany.github.io/my-blog/portfolio/projects/teachers-day",
        type: "portfolio",
      },
    ],
    bullets: [
      {
        text: "학생들은 원하는 카네이션 편지지를 선택하고 편지를 작성하게 되면 교수님의 정장에 카네이션 표시",
      },
      {
        text: "이미지의 특정 영역을 선택하여 해당 영역에 카네이션을 달 수 있도록 구현",
      },
    ],
  },
  {
    title: "[Ready To Work 프로젝트]",
    period: "2024.05.11 - 2024.05.14",
    overview: `Ready To Work 프로젝트는 "회사가 채용 프로세스를 간소화하면서 검증된 인재를 채용할 수 없을까?" 라는 질문으로부터 시작된 프로젝트입니다.`,
    tooltipImages: {
      "Ready To Work 프로젝트": "/assets/rtw-excel-upload.png",
    },
    portfolioLinks: [
      {
        title: "Ready To Work 프로젝트 포트폴리오",
        url: "https://jongmany.github.io/my-blog/portfolio/projects/ready-to-work",
        type: "portfolio",
      },
    ],
    bullets: [
      {
        text: "D3.js를 통해 LLM 기반의 가설 좌표를 시각화",
      },
      {
        text: "일상 생활 속 다양한 질문들에 대해 얼마나 넓고 깊게 대답 하는지를 LLM 기반의 AI로 분석하여 점수화",
      },
    ],
  },
];

