import React from "react";
import { AiContentSection } from "./sections/AiContentSection";
import { NavigationBarSection } from "./sections/NavigationBarSection/NavigationBarSection";

export const ConductingTax = (): JSX.Element => {
  return (
    <div
      className="flex min-w-[1024px] min-h-screen w-full bg-white"
      data-model-id="11:9207"
    >
      <NavigationBarSection />
      <AiContentSection />
    </div>
  );
};
