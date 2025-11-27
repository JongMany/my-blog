import React from "react";
import { cn } from "@srf/ui";

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto mb-4">
      <table
        {...props}
        className={cn(
          "min-w-full border-collapse border border-gray-300 dark:border-gray-700",
          props.className,
        )}
      />
    </div>
  );
}

export function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={cn("bg-gray-50 dark:bg-gray-800", props.className)}
    />
  );
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cn(
        "border-b border-gray-200 dark:border-gray-700",
        props.className,
      )}
    />
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableCellElement>,
) {
  return (
    <th
      {...props}
      className={cn(
        "px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        props.className,
      )}
    />
  );
}

export function TableCell(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={cn(
        "px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300",
        props.className,
      )}
    />
  );
}


