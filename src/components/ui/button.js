import React from "react";

export const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg text-white ${className}`}
    {...props}
  >
    {children}
  </button>
);
