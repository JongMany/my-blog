import { imageSource } from "@mfe/shared";

/**
 * Shell/Home 앱용 이미지 소스 생성 함수
 * 개발/프로덕션 환경에 따라 적절한 호스트 URL을 사용합니다.
 */
export const getImageSource = imageSource("home", {
  isDevelopment: import.meta.env.MODE === "development",
});

