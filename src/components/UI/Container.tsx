
import React from "react";

const Container: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
);

export default Container;
