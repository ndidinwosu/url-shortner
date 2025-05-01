import React from "react";

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: string;
  className?: string;
}

export function Grid({
  children,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-4",
  className = "",
}: GridProps) {
  // Generate grid-cols classes based on the cols object
  const colClasses = Object.entries(cols)
    .map(([breakpoint, count]) =>
      breakpoint === "default"
        ? `grid-cols-${count}`
        : `${breakpoint}:grid-cols-${count}`
    )
    .join(" ");

  return (
    <div className={`grid ${colClasses} ${gap} ${className}`}>{children}</div>
  );
}
