import React from "react";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { Separator } from "../../components/ui/separator";
import { ContextualInfoSection } from "./sections/ContextualInfoSection/ContextualInfoSection";
import { DocumentListSection } from "./sections/DocumentListSection";

const ExtractingDocumentScreenContent = (): JSX.Element => {
  return (
    <main
      className="flex min-w-[1024px] min-h-screen relative bg-white"
      data-model-id="13:15604"
    >
      <section className="flex-1 flex">
        <ContextualInfoSection />
        <Separator orientation="vertical" className="h-auto" />
        <DocumentListSection />
      </section>
    </main>
  );
};

export const ExtractingDocumentScreen = (): JSX.Element => {
  return (
    <ScreenErrorBoundary screenName="ExtractingDocumentScreen">
      <ExtractingDocumentScreenContent />
    </ScreenErrorBoundary>
  );
};
