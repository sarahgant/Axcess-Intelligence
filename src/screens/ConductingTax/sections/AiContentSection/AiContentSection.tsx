import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Textarea } from "../../../../components/ui/textarea";
import { WKIcons } from "../../../../components/ui/wk-icon";

export const AiContentSection = (): JSX.Element => {
  // Data for the AI prompts
  const aiPrompts = [
    "Explain the rules for deducting business meals under current IRS guidance.",
    "What are the federal and state filing deadlines for S corporations this year?",
    "List IRS updates from the past 30 days affecting partnership reporting requirements.",
    "Show me the primary source citation for the qualified business income (QBI) deduction rules.",
    "Compare federal vs. state treatment of net operating loss carryforwards.",
  ];

  // Data for the quick response options
  const responseOptions = ["Individual taxpayers", "Businesses", "Both"];

  return (
    <div className="flex flex-col items-start justify-center flex-1 self-stretch grow">
      <header className="flex h-14 items-center gap-4 px-4 py-3 w-full bg-white">
        <div className="flex items-center gap-2 flex-1">
          <WKIcons.LargeSparkles className="w-6 h-6" />
          <h3 className="cch-intelligence-title">
            CCH Axcess™ Intelligence
          </h3>
        </div>
      </header>

      <div className="flex flex-col items-center justify-end gap-5 px-4 py-6 flex-1 w-full bg-white">
        <div className="flex flex-col items-center gap-4 flex-1 w-full max-w-[800px]">
          {/* User query */}
          <div className="flex flex-col w-full max-w-[800px] items-end gap-2.5">
            <Card className="max-w-[400px] bg-[#f6f6f6] rounded-[16px_16px_0px_16px] border-none shadow-none">
              <CardContent className="p-4">
                <p className="font-body-small-regular text-black-000000 text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)]">
                  Suggest ways to use CCH® AnswerConnect to research tax code,
                  regulations, and IRS guidance efficiently
                </p>
              </CardContent>
            </Card>

            <div className="flex w-[343px] h-8 items-center justify-end gap-2">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="p-2">
                  <div className="w-4 h-4 bg-[url(https://c.animaapp.com/mdxksposqojnwc/img/color-3.svg)] bg-[100%_100%]" />
                </Button>
                <Button variant="ghost" size="icon" className="p-2">
                  <img
                    className="w-3.5 h-3.5"
                    alt="Edit"
                    src="https://c.animaapp.com/mdxksposqojnwc/img/color-2.svg"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* AI response */}
          <div className="flex w-full max-w-[800px] items-start gap-4 pl-0 pr-20 py-0">
            <div className="w-5 h-5 flex items-center justify-center">
              <img
                className="w-5 h-5"
                alt="AI Assistant"
                src="https://c.animaapp.com/mdxksposqojnwc/img/open-0400-wk-ai-generate.svg"
              />
            </div>

            <div className="flex flex-col max-w-[800px] w-[660px] items-start gap-4">
              <div className="flex flex-col w-full items-start gap-4">
                <p className="font-body-small-regular text-[#242424] text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)]">
                  Sure! Here are some prompts that you might find useful to
                  leverage CCH® AnswerConnect to research tax code, regulations,
                  and IRS guidance efficiently:
                </p>

                <div className="flex flex-col w-full items-start gap-1">
                  {aiPrompts.map((prompt, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Card className="max-w-[800px] bg-white rounded border border-solid border-[#dadada] shadow-none">
                        <CardContent className="p-0">
                          <div className="inline-flex items-center justify-center gap-1.5 px-1.5 py-1 bg-white rounded border border-solid border-[#757575]">
                            <p className="font-body-small-regular text-[#242424] text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] whitespace-nowrap">
                              {prompt}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                <p className="font-body-small-regular text-[#242424] text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)]">
                  Would you prefer prompts tailored to individual taxpayers,
                  businesses, or both?
                </p>
              </div>

              <div className="flex w-[343px] h-8 items-center gap-2">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="p-2">
                    <img
                      className="w-[15px] h-[15px]"
                      alt="Like"
                      src="https://c.animaapp.com/mdxksposqojnwc/img/color-8.svg"
                    />
                  </Button>
                  <Button variant="ghost" size="icon" className="p-2">
                    <img
                      className="w-[15px] h-[15px]"
                      alt="Dislike"
                      src="https://c.animaapp.com/mdxksposqojnwc/img/color-7.svg"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick response options and input area */}
        <div className="flex flex-col max-w-[800px] w-full items-start gap-4">
          <div className="flex flex-wrap items-start gap-[8px_8px] px-0 py-1 w-full">
            {responseOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-white rounded border border-solid border-[#757575] px-1.5 py-1 h-auto"
              >
                <span className="text-[#232323] font-wk-cg3-ct-button-font-size-s-1-125-default text-[length:var(--wk-cg3-ct-button-font-size-s-1-125-default-font-size)] tracking-[var(--wk-cg3-ct-button-font-size-s-1-125-default-letter-spacing)] leading-[var(--wk-cg3-ct-button-font-size-s-1-125-default-line-height)]">
                  {option}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <Textarea
              className="w-full bg-white border border-solid border-[#757575] pl-4 pr-2 pt-3 pb-1 min-h-[80px]"
              placeholder="Ask your assistant a question ..."
            />

            <div className="flex w-full items-baseline gap-1">
              <p className="font-wk-cg3-st-body-font-size-xs-1-5-normal text-[#757575] text-[length:var(--wk-cg3-st-body-font-size-xs-1-5-normal-font-size)] tracking-[var(--wk-cg3-st-body-font-size-xs-1-5-normal-letter-spacing)] leading-[var(--wk-cg3-st-body-font-size-xs-1-5-normal-line-height)]">
                The responses are AI generated and might not always be factually
                true. Verifying facts and sources is recommended.
              </p>
              <Button variant="link" className="p-0 h-auto">
                <span className="font-link-micro-micro-link text-[#005b92] text-[length:var(--link-micro-micro-link-font-size)] tracking-[var(--link-micro-micro-link-letter-spacing)] leading-[var(--link-micro-micro-link-line-height)]">
                  See more info
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
