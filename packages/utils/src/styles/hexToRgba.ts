export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // HEX가 #RRGGBB 또는 #RRGGBBAA인지 확인
  hex = hex.replace(/^#/, "");
  let r, g, b;

  if (hex.length === 3) {
    // 3자리 HEX → 6자리 HEX로 변환 (e.g., #123 → #112233)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error("Invalid HEX color.");
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
