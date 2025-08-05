import React, { useState } from "react";
import { WKIcons } from "./wk-icon";

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Theme toggle functionality can be implemented later
    // For now, this just prevents the build error
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 text-[#757575] hover:text-[#353535] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <WKIcons.Sun className="w-4 h-4" />
      ) : (
        <WKIcons.Moon className="w-4 h-4" />
      )}
    </button>
  );
};