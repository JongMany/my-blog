import * as React from "react";
import { cn } from "../../utils";

interface TossAnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  variant?: "default" | "title" | "subtitle" | "caption";
  animationType?: "fade" | "typing" | "char-by-char" | "word-by-word";
  delay?: number;
  speed?: number;
}

function TossAnimatedText({
  children,
  variant = "default",
  animationType = "fade",
  delay = 0,
  speed = 80,
  className,
  ...props
}: TossAnimatedTextProps) {
  const [visibleChars, setVisibleChars] = React.useState(0);
  const [visibleWords, setVisibleWords] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);

  const variantClasses = {
    default: "text-base text-gray-700 dark:text-gray-300",
    title: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100",
    subtitle: "text-lg font-semibold text-gray-800 dark:text-gray-200",
    caption: "text-sm text-gray-500 dark:text-gray-400",
  };

  // 글자별 애니메이션
  React.useEffect(() => {
    if (animationType === "char-by-char") {
      const timer = setTimeout(() => {
        let currentChar = 0;
        const interval = setInterval(() => {
          if (currentChar < children.length) {
            setVisibleChars(currentChar + 1);
            currentChar++;
          } else {
            clearInterval(interval);
            setTimeout(() => setShowCursor(false), 500);
          }
        }, speed);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [children, animationType, delay, speed]);

  // 단어별 애니메이션
  React.useEffect(() => {
    if (animationType === "word-by-word") {
      const words = children.split(" ");
      const timer = setTimeout(() => {
        let currentWord = 0;
        const interval = setInterval(() => {
          if (currentWord < words.length) {
            setVisibleWords(currentWord + 1);
            currentWord++;
          } else {
            clearInterval(interval);
          }
        }, speed * 2);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [children, animationType, delay, speed]);

  // 타이핑 애니메이션
  if (animationType === "typing") {
    return (
      <div
        className={cn(
          variantClasses[variant],
          "toss-typing-container",
          className,
        )}
        style={{
          animationDelay: `${delay}ms`,
        }}
        {...props}
      >
        <span className="toss-typing-text">{children}</span>
        <span className="toss-cursor" />
      </div>
    );
  }

  // 글자별 애니메이션
  if (animationType === "char-by-char") {
    return (
      <div className={cn(variantClasses[variant], className)} {...props}>
        {children.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              "inline-block",
              index < visibleChars && "animate-toss-char-appear",
            )}
            style={{
              opacity: index < visibleChars ? 1 : 0,
              animationDelay: `${index * 50}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        {showCursor && visibleChars === children.length && (
          <span className="toss-cursor" />
        )}
      </div>
    );
  }

  // 단어별 애니메이션
  if (animationType === "word-by-word") {
    const words = children.split(" ");
    return (
      <div className={cn(variantClasses[variant], className)} {...props}>
        {words.map((word, index) => (
          <span
            key={index}
            className={cn(
              "inline-block mr-2",
              index < visibleWords && "animate-toss-word-fade",
            )}
            style={{
              opacity: index < visibleWords ? 1 : 0,
              animationDelay: `${index * 100}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // 기본 페이드 애니메이션
  return (
    <div
      className={cn(variantClasses[variant], "animate-toss-fade-in", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { TossAnimatedText };
