
import React from "react";

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`w-full max-w-7xl mx-auto px-4 ${className}`}>{children}</div>
);

export default Container;
