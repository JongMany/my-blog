import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import { useBoolean } from "@mfe/shared";
import { processImageSource, createImageStyle } from "@/components/mdx/lib/utils";
import type { ImageProps } from "@/components/mdx/lib/types";

export function Image({
  alt,
  src,
  source,
  description,
  figcaption,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const { value: isDialogOpen, toggle, setFalse: closeDialog } = useBoolean(false);
  const processedSrc = processImageSource(src);
  
  if (!processedSrc) return null;

  // width가 지정되면 스타일에서 min(width, 100%)로 처리하고, width가 없으면 기본 최대 너비 제한
  const imageClassName = cn(
    "mb-1 h-auto cursor-pointer rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow",
    width ? "" : "w-full max-w-4xl",
    className,
  );

  const imageElement = (
    <img
      alt={alt ?? ""}
      src={processedSrc}
      className={imageClassName}
      style={createImageStyle(width, height)}
      loading="lazy"
      {...props}
    />
  );

  const dialogContent = (
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
        onClick={closeDialog}
      />
    </DialogContent>
  );

  const imageWithDialog = (
    <div className="relative w-full flex justify-center">
      <Dialog modal={false} open={isDialogOpen} onOpenChange={toggle}>
        <DialogTrigger asChild>{imageElement}</DialogTrigger>
        {dialogContent}
      </Dialog>
      {figcaption && (
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500 text-center px-3 py-1.5 bg-black/70 dark:bg-black/80 backdrop-blur-sm rounded-md max-w-[90%] whitespace-nowrap">
          {figcaption}
        </figcaption>
      )}
    </div>
  );

  const metadataSection = (
    <>
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

  const containerClassName = "flex w-full max-w-full flex-col items-center overflow-hidden my-8";
  const content = (
    <>
      {imageWithDialog}
      {metadataSection}
    </>
  );

  return figcaption ? (
    <figure className={containerClassName}>{content}</figure>
  ) : (
    <div className={containerClassName}>{content}</div>
  );
}
