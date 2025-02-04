import React from "react";

export const Card = ({ children, className }) => (
  <div className={`p-4 rounded-lg shadow-md ${className}`}>{children}</div>
);

export const CardContent = ({ children }) => <div>{children}</div>;
