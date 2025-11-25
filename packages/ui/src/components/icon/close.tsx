interface CloseIconProps {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

export function CloseIcon({
  className,
  size = 16,
  width,
  height,
}: CloseIconProps = {}) {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={iconWidth}
      height={iconHeight}
      className={className}
      fill="none"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.815 12l5.651-5.651a1.2 1.2 0 00-1.697-1.698l-5.651 5.652-5.652-5.652a1.201 1.201 0 00-1.697 1.698L10.421 12l-5.652 5.651a1.202 1.202 0 00.849 2.049c.307 0 .614-.117.848-.351l5.652-5.652 5.651 5.652a1.198 1.198 0 001.697 0 1.2 1.2 0 000-1.698L13.815 12z"
      ></path>
    </svg>
  );
}
