import {
  MoreVerticalIcon,
} from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { WKIcons } from "../../../../components/ui/wk-icon";

export const NavigationBarSection = (): JSX.Element => {
  // Navigation history data
  const historyItems = [
    {
      title:
        "Suggest ways to use CCH® AnswerConnect to research tax code, regulations, and IRS guidance efficiently",
      isActive: true,
    },
  ];

  // Footer navigation items
  const footerNavItems = [
    { title: "Privacy", icon: <WKIcons.Privacy className="w-4 h-4 text-[#353535]" /> },
    { title: "About", icon: <WKIcons.About className="w-4 h-4 text-[#353535]" /> },
    { title: "Profile", icon: <WKIcons.User className="w-4 h-4 text-[#353535]" /> },
  ];

  return (
    <nav className="flex flex-col h-full w-[272px] bg-white border-r border-[#ededed]">
      {/* Top navigation */}
      <div className="flex-1 flex flex-col">
        {/* Header with back and search buttons */}
        <div className="flex h-14 items-center justify-between w-full">
          <Button variant="ghost" size="icon" className="w-14 h-14">
            <WKIcons.ChevronDouble className="w-4 h-4 text-[#757575]" />
          </Button>
          <Button variant="ghost" size="icon" className="w-14 h-14">
            <WKIcons.Search className="w-4 h-4 text-[#353535]" />
          </Button>
        </div>

        {/* New Conversation button */}
        <div className="px-5 py-0">
          <Button
            variant="outline"
            className="w-[232px] h-[34px] border-[#005B92] text-[#005B92] flex items-center justify-center gap-2"
          >
            <WKIcons.Plus className="w-4 h-4 text-[#005B92]" />
            <span className="font-['Fira_Sans'] text-sm font-normal">
              New Conversation
            </span>
          </Button>
        </div>

        {/* History section */}
        <div className="flex flex-col pt-4">
          <div className="flex items-center px-5 py-1">
            <WKIcons.Clock className="w-4 h-4 mr-2 text-[#2e2e2e]" />
            <span className="font-heading-EYEBROW-EYEBROW-step-1 text-[#2e2e2e] text-xs tracking-[1px] leading-4 font-medium">
              HISTORY
            </span>
          </div>

          {/* Accordion for history items */}
          <Accordion type="single" defaultValue="today" className="w-full">
            <AccordionItem value="today" className="border-0">
              <AccordionTrigger className="px-5 py-0 hover:no-underline">
                <span className="font-heading-EYEBROW-EYEBROW-step-1 text-[#3c3c3c] text-xs tracking-[1px] leading-4 font-medium">
                  TODAY
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-0">
                <div className="h-[120px]">
                  {historyItems.map((item, index) => (
                    <div key={index} className="px-5 py-0">
                      <div
                        className={`flex h-10 items-center gap-1 ${item.isActive ? "bg-bluetint6-f2f8fc" : ""}`}
                      >
                        <div className="flex items-center pl-1 pr-0 py-0 flex-1">
                          <span
                            className={`flex-1 font-link-nav-medium-active text-sm leading-[18px] ${item.isActive ? "text-blueshade1-005b92 font-medium" : "text-grayshade-1 font-normal"}`}
                          >
                            {item.title}
                          </span>
                          {item.isActive && (
                            <Button variant="ghost" size="icon" className="p-2">
                              <MoreVerticalIcon className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Scrollbar indicator */}
          <div className="relative">
            <div className="absolute w-1.5 h-[100px] top-8 right-2.5">
              <div className="w-2 h-[102px] -top-px -left-px bg-graytint2-a3a3a3 rounded-[3px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex-shrink-0 bg-white border-r border-[#ededed]" style={{ marginTop: '-8px' }}>
        <div className="px-4 pt-0 pb-2">
          <Separator className="bg-[#d9d9d9]" />
        </div>

        {footerNavItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="flex w-full h-10 items-center justify-start px-4 rounded-none"
          >
            {item.icon}
            <span className="ml-6 font-link-nav-regular text-grayshade-1 text-sm leading-[18px] font-normal">
              {item.title}
            </span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
