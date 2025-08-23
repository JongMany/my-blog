export const checkIsMobile = () => {
  // "Mobi" 가 User agent에 포함되어 있으면 모바일
  return /Mobi/i.test(window.navigator.userAgent);
};

export const checkIsPortableDevice = () => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
};

export const checkIsTouchDevice = () => {
  return (
    /Mobi/i.test(window.navigator.userAgent) ||
    window.navigator.maxTouchPoints > 0
  );
};

export const checkIsIosDevice = () => {
  return /iPhone|iPad|iPod|Mac/i.test(window.navigator.userAgent);
};

export const checkIsSafariBrowser = () => {
  const userAgentString = navigator.userAgent;
  const chromeAgent = userAgentString.indexOf("Chrome") > -1;
  const safariAgent = userAgentString.indexOf("Safari") > -1;

  return !(chromeAgent && safariAgent);
};

export const checkIsTargetStudioDynamicLink = () => {
  return checkIsMobile() && window.innerWidth < 980;
};

export const checkIsInBubbleTapApp = () => {
  return /BubbleTapApp/i.test(window.navigator.userAgent);
};

export const checkIsWindow = () => {
  return /Win/i.test(window.navigator.userAgent);
};

export const checkIsAosDevice = () => {
  const userAgent = navigator.userAgent;
  return /android/i.test(userAgent);
};
