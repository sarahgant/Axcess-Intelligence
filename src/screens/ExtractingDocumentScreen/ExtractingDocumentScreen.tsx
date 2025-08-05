import React from "react";
import { Separator } from "../../components/ui/separator";
import { ContextualInfoSection } from "./sections/ContextualInfoSection/ContextualInfoSection";
import { DocumentListSection } from "./sections/DocumentListSection";

export const ExtractingDocumentScreen = (): JSX.Element => {
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
