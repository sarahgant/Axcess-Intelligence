import React from "react";
import { ContextualInfoSection } from "../ExtractingDocumentScreen/sections/ContextualInfoSection/ContextualInfoSection";
import { DocumentListSection } from "../ExtractingDocumentScreen/sections/DocumentListSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { NavigationBarSection } from "./sections/NavigationBarSection/NavigationBarSection";

export const ExtractingDocument = (): JSX.Element => {
  return (
    <main
      className="flex min-w-[1024px] min-h-screen bg-white"
      data-model-id="12:13304"
    >
      <div className="flex w-[27%]">
        <NavigationBarSection />
        <ContextualInfoSection />
      </div>
      <div className="flex w-[73%]">
        <DocumentListSection />
        <MainContentSection />
      </div>
    </main>
  );
};
