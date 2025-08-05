import React from "react";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { ChatSection } from "./sections/ChatSection";

export const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation Bar */}
      <NavigationBarSection />
      
      {/* Main Chat Area */}
      <ChatSection className="flex-1" />
    </div>
  );
};