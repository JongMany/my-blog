import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import { useBoolean } from "@mfe/shared";
import { processImageSource, createImageStyle } from "../lib/utils";
import type { ImageProps } from "../lib/types";

export function Image({
  alt,
  src,
  source,
  description,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const { value: opened, toggle, setFalse: close } = useBoolean(false);
  const processedSrc = processImageSource(src);
  if (!processedSrc) return null;

  return (
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden my-8">
      <Dialog modal={false} open={opened} onOpenChange={toggle}>
        <DialogTrigger asChild>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className={cn(
              "mb-1 h-auto w-full max-w-full cursor-pointer rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow",
              className,
            )}
            style={createImageStyle(width, height)}
            width={width}
            height={height}
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
            onClick={close}
          />
        </DialogContent>
      </Dialog>
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
    </div>
  );
}

