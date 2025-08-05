import React from "react";
import { WKIcons } from "../../../../components/ui/wk-icon";
import { CCHIntelligenceTitle } from "../../../../components/ui/cch-intelligence-title";
import { ThemeToggle } from "../../../../components/ui/theme-toggle";

export const NavigationBarSection: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      {/* Left side - Title with sparkle icon */}
      <div className="flex items-center gap-3">
        <WKIcons.AIGenerate className="w-6 h-6 text-[#005B92]" aria-hidden="true" />
        <CCHIntelligenceTitle />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* New Conversation Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#005B92] rounded-md hover:bg-[#005B92]/90 transition-colors">
          <WKIcons.PlusCircle className="w-4 h-4" aria-hidden="true" />
          New Conversation
        </button>

        {/* Theme Toggle, Settings and Profile Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button className="p-2 text-[#757575] hover:text-[#353535] transition-colors">
            <WKIcons.Settings className="w-4 h-4" aria-label="Settings" />
          </button>
          
          <button className="p-2 text-[#757575] hover:text-[#353535] transition-colors">
            <WKIcons.User className="w-4 h-4" aria-label="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
};