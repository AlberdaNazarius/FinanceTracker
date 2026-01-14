import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen sm:px-2 mx-auto max-w-7xl sm:py-2">
      {children}
    </div>
  );
};

export default Layout;
