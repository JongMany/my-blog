import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { DetailedHTMLProps, ReactNode, VideoHTMLAttributes } from "react";
import { useBoolean, imageSource } from "@mfe/shared";
import { calculateMyAge } from "@/utils/calculate-my-age";

export function MDX({
  scope = {},
  ...props
}: Omit<MDXRemoteProps, "scope"> & { scope?: Record<string, any> }) {
  return (
    <MDXRemote
      {...props}
      scope={scope}
      components={{
        Image,
        Link: MDXLink,
        Video,
        Resource,
        MyThought,
        Short,
        Long,
        Year,
        Month,
        Age,
        BooksLeftToRead,
      }}
    />
  );
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  source?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
};

function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;

  const isExternalUrl = /^https?:\/\//i.test(src);
  if (isExternalUrl) return src;

  // 개발/프로덕션 환경에 따라 적절한 호스트 URL을 사용
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, "blog", {
    isDevelopment,
  });
}

function createImageStyle(
  width?: number | string,
  height?: number | string,
): React.CSSProperties | undefined {
  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

function Image({
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
  const imageStyle = createImageStyle(width, height);

  return (
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden">
      <Dialog modal={false} open={opened} onOpenChange={toggle}>
        <DialogTrigger asChild>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className={cn(
              "mb-1 mt-8 h-auto w-full max-w-full cursor-pointer rounded-lg object-contain",
              className,
            )}
            style={imageStyle}
            width={width}
            height={height}
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
      {source && <p className="text-xs text-gray-500">[출처: {source}]</p>}
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}

function Video({
  src,
  ...props
}: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
  return (
    <video
      src={src}
      className="h-auto w-full rounded-lg"
      playsInline
      {...props}
    />
  );
}

function Resource({ href, children }: { href?: string; children: ReactNode }) {
  return (
    <div className="flex w-full justify-end">
      {href ? (
        <Link
          to={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500"
        >
          {children}
        </Link>
      ) : (
        <p className="text-xs text-gray-500">{children}</p>
      )}
    </div>
  );
}

function MyThought({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      {children}
    </div>
  );
}

function Short() {
  return (
    <div className="flex w-full items-center gap-1 border-b border-gray-200 pb-2">
      <span className="text-xl font-semibold ">숏</span>
      <Activity size={20} color="#98a3cd" />
    </div>
  );
}

function Long() {
  return (
    <div className="flex w-full items-center gap-1 border-b border-gray-200 pb-2">
      <span className="text-xl font-semibold ">롱</span>
      <Activity size={20} color="#ed1d65" className="scale-x-[-1] transform" />
    </div>
  );
}

function Year() {
  return <span>{new Date().getFullYear()}</span>;
}

function Month() {
  return <span>{new Date().getMonth() + 1}</span>;
}

function Age() {
  return <span>{calculateMyAge()}</span>;
}

function BooksLeftToRead() {
  const age = calculateMyAge();
  const booksLeftToRead = (70 - age) * 18;

  return <span>{booksLeftToRead}</span>;
}

// MDX에서 사용할 Link 컴포넌트 (외부 링크는 일반 <a> 태그로 처리)
function MDXLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  // 외부 링크인 경우
  if (
    href?.startsWith("http://") ||
    href?.startsWith("https://") ||
    href?.startsWith("//")
  ) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  // 내부 링크인 경우 React Router Link 사용
  return (
    <Link to={href ?? "#"} {...props}>
      {children}
    </Link>
  );
}
