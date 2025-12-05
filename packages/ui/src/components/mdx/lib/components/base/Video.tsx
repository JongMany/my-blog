import type { DetailedHTMLProps, VideoHTMLAttributes } from "react";

export function Video({
  src,
  className,
  ...props
}: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
  return (
    <video
      src={src}
      className={`h-auto w-full rounded-lg ${className ?? ""}`}
      playsInline
      {...props}
    />
  );
}

