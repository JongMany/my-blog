import React from "react";
import type { ReactNode, ReactElement } from "react";

interface HeroProps {
  children: ReactNode;
  key: string;
  [key: string]: any;
}

export const Hero = ({ children, key, ...props }: HeroProps): ReactElement => {
  return (
    <div data-hero-key={key} {...props}>
      {children}
    </div>
  );
};
