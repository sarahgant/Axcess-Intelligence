import React from "react";
import { WKIcons } from "../../../../components/ui/wk-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

export const ContextualInfoSection = (): JSX.Element => {
  // Data for navigation icons
  const navIcons = [
    {
      icon: "user",
      alt: "Color",
    },
    {
      icon: "security",
      alt: "Color",
    },
  ];

  // Data for footer navigation items
  const footerNavItems = [
    {
      icon: "info",
      label: "Privacy",
    },
    {
      icon: "help",
      label: "About",
      isBackgroundImage: true,
    },
    {
      icon: "settings",
      label: "Profile",
    },
  ];

  // Conversation history data
  const conversations = [
    {
      text: "Suggest ways to use CCH® AnswerConnect to research tax code, regulations, and IRS guidance efficiently",
    },
  ];

  return (
    <aside className="flex flex-col h-full border-r border-[#ededed] bg-white">
      {/* Top navigation */}
      <div className="flex-1 flex flex-col">
        <div className="flex h-14 items-center justify-between w-full">
          {navIcons.map((icon, index) => (
            <div key={index} className="relative w-14 h-14">
              <div className="inline-flex items-start relative top-2 left-2">
                <div className="p-3 inline-flex items-start gap-2.5">
                  <div className="relative w-4 h-4">
                    <img
                      className={`absolute ${index === 0 ? "w-3.5 h-[13px] top-0.5 left-px" : "w-3.5 h-3.5 top-px left-px"}`}
                      alt={icon.alt}
                      src={icon.src}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Conversation button */}
        <div className="px-5 py-0 mb-4">
          <Button
            variant="outline"
            className="w-[232px] h-[34px] border-[#005B92] text-[#005B92] flex items-center justify-center gap-2"
          >
            <WKIcons.Plus className="w-4 h-4 text-[#005B92]" />
            <span className="font-normal text-sm">New Conversation</span>
          </Button>
        </div>

        {/* History section */}
        <div className="flex flex-col">
          <div className="flex items-center px-5 py-1 gap-2">
            <div className="relative w-4 h-4">
              <WKIcons.Document className="absolute w-[15px] h-[15px] top-px left-px" />
            </div>
            <span className="font-heading-EYEBROW-EYEBROW-step-1 text-[#2e2e2e] text-xs tracking-wider uppercase">
              HISTORY
            </span>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="today"
            className="w-full"
          >
            <AccordionItem value="today" className="border-none">
              <AccordionTrigger className="px-5 py-0 hover:no-underline">
                <span className="font-heading-EYEBROW-EYEBROW-step-1 text-[#3c3c3c] text-xs tracking-wider uppercase">
                  TODAY
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-0">
                <div className="flex flex-col">
                  {conversations.map((conversation, index) => (
                    <div key={index} className="px-5 py-0">
                      <div className="flex h-10 items-center gap-1 w-full">
                        <div className="flex items-center pl-1 pr-0 py-0 flex-1 bg-bluetint6-f2f8fc">
                          <div className="flex-1 font-link-nav-medium-active text-blueshade1-005b92 text-sm">
                            {conversation.text}
                          </div>
                          <div className="p-2 inline-flex">
                            <div className="relative w-4 h-4">
                              <WKIcons.Menu className="absolute w-1 h-4 top-0 left-1.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Scrollbar indicator */}
          <div className="absolute w-1.5 h-[100px] top-8 right-1">
            <div className="relative w-2 h-[102px] -top-px -left-px bg-graytint2-a3a3a3 rounded-[3px]" />
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="border-t border-[#ededed]" style={{ marginTop: '-8px' }}>
        <Separator className="mx-4 mt-0 mb-2 bg-[#d9d9d9]" />

        <nav>
          {footerNavItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start h-10 px-4 font-link-nav-regular text-grayshade-1"
            >
              <div className="relative w-4 h-4 mr-2">
                {item.icon === "user" && <WKIcons.User className="absolute w-[15px] h-4 top-0 left-px" />}
                {item.icon === "security" && <WKIcons.Privacy className="absolute w-[15px] h-4 top-0 left-px" />}
                {item.icon === "info" && <WKIcons.About className="absolute w-[15px] h-4 top-0 left-px" />}
                {item.icon === "help" && <WKIcons.Help className="absolute w-[15px] h-4 top-0 left-px" />}
                {item.icon === "settings" && <WKIcons.Settings className="absolute w-[15px] h-4 top-0 left-px" />}
              </div>
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
