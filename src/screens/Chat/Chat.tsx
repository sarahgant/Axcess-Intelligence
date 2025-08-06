import React from "react";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { ChatSection } from "./sections/ChatSection";

const ChatContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation Bar */}
      <NavigationBarSection />
      
      {/* Main Chat Area */}
      <ChatSection className="flex-1" />
    </div>
  );
};

export const Chat: React.FC = () => {
  return (
    <ScreenErrorBoundary screenName="Chat">
      <ChatContent />
    </ScreenErrorBoundary>
  );
};