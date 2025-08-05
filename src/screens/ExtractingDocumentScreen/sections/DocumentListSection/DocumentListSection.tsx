
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { WKIcons } from "../../../../components/ui/wk-icon";

export const DocumentListSection = (): JSX.Element => {
  // Data for prompt suggestions
  const promptSuggestions = [
    "Summarize the key information in [DOCUMENT].",
    "Extract all payment dates and amounts from [RECEIPT DOCUMENT].",
    "Compare [CURRENT YEAR TAX RETURN] to [PRIOR YEAR TAX RETURN] and highlight major differences.",
    "Identify discrepancies between [DOCUMENT VERSION 1] and [DOCUMENT VERSION 2].",
    "Generate a client-friendly summary email explaining [IRS NOTICE DOCUMENT].",
  ];

  // Data for category buttons
  const categories = ["Summarizing", "Comparing", "Extracting data"];

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-white">
      <header className="flex h-14 items-center gap-4 px-4 py-3 w-full bg-white border-b">
        <div className="flex items-center gap-2 flex-1">
          <WKIcons.LargeSparkles className="w-6 h-6" />
          <h3 className="cch-intelligence-title">
            CCH Axcess™ Intelligence
          </h3>
        </div>
      </header>

      <div className="flex flex-col flex-1 p-4 gap-5 overflow-y-auto">
        <div className="flex flex-col items-center gap-4 w-full max-w-[800px] mx-auto">
          {/* User question */}
          <div className="flex flex-col items-end gap-2.5 w-full">
            <div className="inline-flex max-w-[400px] items-start gap-4 px-4 py-2 bg-graytint6-f6f6f6 rounded-[16px_16px_0px_16px]">
              <p className="font-body-small-regular text-black-000000">
                Suggest ways to summarize, compare, validate, and extract data
                from tax returns and related documents
              </p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex items-start gap-4 pl-0 pr-20 py-0 w-full">
            <div className="w-5 h-5 flex items-center justify-center">
              <WKIcons.AIGenerate className="w-5 h-5" />
            </div>

            <div className="flex flex-col gap-4 max-w-[800px] w-full">
              <div className="flex flex-col gap-4 w-full">
                <p className="font-body-small-regular text-[#242424]">
                  Sure! Here are some prompts that you might find useful to
                  summarize, compare, validate, and extract data from tax
                  returns and related documents:
                </p>

                <div className="flex flex-col gap-1">
                  {promptSuggestions.map((prompt, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="bg-white border-graytint1-757575 rounded px-1.5 py-1"
                      >
                        <span className="font-body-small-regular text-[#242424] whitespace-nowrap">
                          {prompt}
                        </span>
                      </Badge>
                    </div>
                  ))}
                </div>

                <p className="font-body-small-regular text-[#242424]">
                  Would you like me to focus on summarizing, comparing, or
                  extracting data from documents?
                </p>
              </div>

              <div className="flex items-center gap-2 h-8">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="p-2">
                    <div className="w-4 h-4">
                      <WKIcons.Refresh className="w-[15px] h-[15px]" />
                    </div>
                  </Button>
                  <Button variant="ghost" size="icon" className="p-2">
                    <div className="w-4 h-4">
                      <WKIcons.Close className="w-[15px] h-[15px]" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* User request with document */}
          <div className="flex flex-col items-end gap-2.5 w-full max-w-[720px]">
            <Card className="max-w-[400px] bg-graytint6-f6f6f6 rounded-[16px_16px_0px_16px] border-0">
              <CardContent className="flex flex-col gap-4 p-4">
                <p className="font-body-small-regular text-black-000000 whitespace-nowrap">
                  Summarize the key information in 2024 General Ledger
                </p>

                <div className="inline-flex items-center bg-white">
                  <div className="inline-flex h-8 items-center border border-graytint4-dadada">
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-4 h-4 bg-white">
                        <WKIcons.PDF className="w-4 h-4" />
                      </div>
                      <span className="font-body-regular-regular-default-14px text-black-000000 whitespace-nowrap">
                        2024 General Ledger.pdf
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-2 h-8 w-[343px]">
              <Button variant="ghost" size="icon" className="p-2">
                <WKIcons.Note className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category buttons and input area */}
        <div className="flex flex-col items-start gap-4 w-full max-w-[800px] mx-auto">
          <div className="flex flex-wrap gap-2 py-1 w-full">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-white border-graytint1-757575 rounded px-1.5 py-1"
              >
                <span className="text-grayshade2-232323 font-wk-cg3-ct-button-font-size-s-1-125-default whitespace-nowrap">
                  {category}
                </span>
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 px-4 py-3 border border-[#757575] bg-white w-full">
              <Input
                className="border-0 shadow-none font-input-normal-placeholder text-[#474747] p-0"
                placeholder="Ask your assistant a question ..."
              />

              <div className="flex items-end justify-end w-full">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="p-3">
                    <WKIcons.PlusCircle className="w-4 h-4 text-[#353535]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="p-3">
                    <WKIcons.Attach className="w-4 h-4 text-[#353535]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="p-3">
                    <WKIcons.Send className="w-4 h-4 text-[#353535]" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-1 w-full">
              <p className="font-wk-cg3-st-body-font-size-xs-1-5-normal text-graytint1-757575">
                The responses are AI generated and might not always be factually
                true. Verifying facts and sources is recommended.
              </p>
              <a
                href="#"
                className="font-link-micro-micro-link text-blueshade1-005b92"
              >
                See more info
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
