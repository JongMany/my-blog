import { DetailedHTMLProps, VideoHTMLAttributes } from "react";

export function Video({
  src,
  ...props
}: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
  return (
    <video
      src={src}
      className="h-auto w-full rounded-lg my-8 shadow-md"
      playsInline
      {...props}
    />
  );
}


