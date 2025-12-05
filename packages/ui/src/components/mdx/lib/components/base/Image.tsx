import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import type { MDXRuntimeConfig } from "../../../types";
import { createImageStyle } from "./image-style";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  source?: string;
  description?: string;
  figcaption?: string;
  width?: number | string;
  height?: number | string;
  runtimeConfig: MDXRuntimeConfig;
}

export function Image({
  alt,
  src,
  source,
  description,
  figcaption,
  width,
  height,
  className,
  runtimeConfig,
  ...props
}: ImageProps) {
  const [opened, setOpened] = useState(false);
  const processedSrc = src
    ? runtimeConfig.processImageSource(src, runtimeConfig.appName)
    : undefined;
  
  if (!processedSrc) return null;

  const imageClassName = cn(
    "mb-1 h-auto cursor-pointer rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow",
    width ? "" : "w-full max-w-4xl",
    className,
  );

  const imageWrapper = (
    <div className="relative w-full flex justify-center">
      <Dialog modal={false} open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className={imageClassName}
            style={createImageStyle(width, height)}
            loading="lazy"
            {...props}
          />
        </DialogTrigger>
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center outline-none bg-transparent p-0 shadow-none max-w-none"
          overlayClassName="bg-black/50"
          hideClose
        >
          <DialogTitle className="sr-only">{alt ?? ""}</DialogTitle>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className="h-auto max-h-full w-auto max-w-full object-contain"
            onClick={() => setOpened(false)}
          />
        </DialogContent>
      </Dialog>
      {figcaption && (
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500 text-center px-3 py-1.5 bg-black/70 dark:bg-black/80 backdrop-blur-sm rounded-md max-w-[90%] whitespace-nowrap">
          {figcaption}
        </figcaption>
      )}
    </div>
  );

  const imageContent = (
    <>
      {imageWrapper}
      {source && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          [출처: {source}]
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {description}
        </p>
      )}
    </>
  );

  if (figcaption) {
    return (
      <figure className="flex w-full max-w-full flex-col items-center overflow-hidden my-8">
        {imageContent}
      </figure>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden my-8">
      {imageContent}
    </div>
  );
}

