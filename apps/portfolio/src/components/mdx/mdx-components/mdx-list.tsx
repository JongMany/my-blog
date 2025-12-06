import React from "react";
import { cn } from "@srf/ui";

export function UnorderedList(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={cn(
        "list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
        props.className,
      )}
    />
  );
}

export function OrderedList(props: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      {...props}
      className={cn(
        "list-decimal pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
        props.className,
      )}
    />
  );
}

export function ListItem(props: React.HTMLAttributes<HTMLLIElement>) {
  return <li {...props} className={cn("leading-relaxed", props.className)} />;
}

