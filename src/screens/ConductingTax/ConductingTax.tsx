import React from "react";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { AiContentSection } from "./sections/AiContentSection";
import { NavigationBarSection } from "./sections/NavigationBarSection/NavigationBarSection";

const ConductingTaxContent = (): JSX.Element => {
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

export const ConductingTax = (): JSX.Element => {
  return (
    <ScreenErrorBoundary screenName="ConductingTax">
      <ConductingTaxContent />
    </ScreenErrorBoundary>
  );
};
