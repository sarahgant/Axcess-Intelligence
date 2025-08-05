import {
  ClockIcon,
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
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { WKIcons } from "../../../../components/ui/wk-icon";

export const NavigationBarSection = (): JSX.Element => {
  // Navigation items for the bottom of the sidebar
  const navigationItems = [
    {
      icon: <WKIcons.Privacy className="w-4 h-4 text-[#353535]" />,
      label: "Privacy",
    },
    {
      icon: <WKIcons.About className="w-4 h-4 text-[#353535]" />,
      label: "About",
    },
    {
      icon: <WKIcons.User className="w-4 h-4 text-[#353535]" />,
      label: "Profile",
    },
  ];

  // Conversation history items
  const historyItems = [
    {
      title:
        "Suggest ways to use CCH® AnswerConnect to research tax code, regulations, and IRS guidance efficiently",
      isActive: true,
    },
  ];

  return (
    <aside className="flex flex-col w-[272px] h-full bg-white border-r border-[#ededed]">
      {/* Top navigation */}
      <div className="flex-1 flex flex-col">
        {/* Header with back and search buttons */}
        <div className="flex h-14 items-center justify-between">
          <Button variant="ghost" size="icon" className="w-14 h-14">
            <WKIcons.ChevronDouble className="w-4 h-4 text-[#757575]" />
          </Button>
          <Button variant="ghost" size="icon" className="w-14 h-14">
            <WKIcons.Search className="w-4 h-4 text-[#353535]" />
          </Button>
        </div>

        {/* New conversation button */}
        <div className="px-5 py-0">
          <Button
            className="w-[232px] h-[34px] flex items-center justify-center gap-2 text-[#005B92] bg-white border border-[#005B92] hover:bg-[#f2f8fc]"
            variant="outline"
          >
            <WKIcons.Plus className="w-4 h-4 text-[#005B92]" />
            <span className="font-['Fira_Sans'] text-sm font-normal">
              New Conversation
            </span>
          </Button>
        </div>

        {/* History section */}
        <div className="flex flex-col pt-4">
          {/* History header */}
          <div className="flex items-center px-5 py-1">
            <ClockIcon className="w-4 h-4 text-[#2e2e2e]" />
            <span className="ml-2 font-heading-EYEBROW-EYEBROW-step-1 text-[#2e2e2e] text-xs tracking-[1px] uppercase">
              HISTORY
            </span>
          </div>

          {/* Conversation history */}
          <ScrollArea className="flex-1">
            <Accordion
              type="single"
              collapsible
              defaultValue="today"
              className="w-full"
            >
              <AccordionItem value="today" className="border-0">
                <AccordionTrigger className="px-5 py-0 hover:no-underline">
                  <span className="font-heading-EYEBROW-EYEBROW-step-1 text-[#3c3c3c] text-xs tracking-[1px] uppercase">
                    TODAY
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-0">
                  <div className="flex flex-col">
                    {historyItems.map((item, index) => (
                      <div key={index} className="px-5 py-0">
                        <div
                          className={`flex h-10 items-center gap-1 ${item.isActive ? "bg-bluetint6-f2f8fc" : ""}`}
                        >
                          <div className="flex items-center pl-1 pr-0 py-0 flex-1">
                            <span
                              className={`flex-1 text-sm font-link-nav-medium-active ${item.isActive ? "text-blueshade1-005b92" : "text-grayshade-1"}`}
                            >
                              {item.title}
                            </span>
                            {item.isActive && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="p-2"
                              >
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
          </ScrollArea>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-[#d9d9d9] bg-white" style={{ marginTop: '-8px' }}>
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="flex w-full h-10 justify-start px-4 rounded-none hover:bg-[#f2f8fc]"
          >
            <div className="flex items-center">
              <div className="w-4 h-4 ml-0 mr-6">{item.icon}</div>
              <span className="font-link-nav-regular text-grayshade-1 text-sm">
                {item.label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </aside>
  );
};
