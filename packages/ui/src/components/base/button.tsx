import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/index";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-my-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        default:
          "bg-accent-solid text-inverse shadow-xs hover:bg-accent-solid-hover",
        destructive:
          "bg-error-solid text-inverse shadow-xs hover:bg-error-solid/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 dark:bg-error-solid/60",
        outline:
          "border border-default bg-panel shadow-xs hover:bg-accent-subtle hover:text-primary dark:bg-panel/30 dark:border-default dark:hover:bg-panel/50",
        secondary:
          "bg-surface text-primary shadow-xs hover:bg-hover",
        ghost:
          "hover:bg-accent-subtle hover:text-primary dark:hover:bg-accent-subtle/50",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-my-md py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-my-sm gap-1.5 px-my-sm has-[>svg]:px-2.5",
        lg: "h-10 rounded-my-md px-my-lg has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
