
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { WKIcons } from "../../components/ui/wk-icon";

export const Document = (): JSX.Element => {
  // Data for suggestion cards
  const suggestionCards = [
    {
      title: "Conducting Tax Research",
      description:
        "Suggest ways to use CCH® AnswerConnect to research tax code, regulations, and IRS guidance efficiently",
    },
    {
      title: "Extracting Document Insights",
      description:
        "Suggest ways to summarize, compare, validate, and extract data from tax returns and related documents",
    },
    {
      title: "Drafting Correspondence",
      description:
        "Suggest ways to draft client messages for various purposes including document requests & billing",
    },
    {
      title: "Navigating CCH Axcess™",
      description:
        "Suggest ways to find user support and how-to guidance across CCH Axcess",
    },
  ];

  // Navigation links
  const navLinks = [
    {
      name: "Privacy",
      icon: "privacy",
    },
    {
      name: "About",
      icon: "about",
    },
    {
      name: "Profile",
      icon: "profile",
    },
  ];

  return (
    <div
      className="flex min-w-[1024px] min-h-screen items-start relative bg-white"
      data-model-id="8:49972"
    >
      {/* Sidebar */}
      <aside className="flex flex-col w-[272px] items-start justify-between relative self-stretch bg-white border-r border-graytint5-ededed">
        {/* Sidebar top section */}
        <div className="flex flex-col w-full items-center flex-1 pt-0 pb-2">
          {/* Top icons */}
          <div className="h-14 items-center justify-between self-stretch w-full flex relative">
            <div className="relative w-14 h-14">
              <div className="inline-flex items-start relative top-2 left-2">
                <div className="inline-flex items-start gap-2.5 p-3 relative">
                  <WKIcons.ChevronDouble className="w-4 h-4 text-[#757575]" />
                </div>
              </div>
            </div>

            <div className="relative w-14 h-14">
              <div className="inline-flex items-start relative top-2 left-2">
                <div className="inline-flex items-start gap-2.5 p-3 relative">
                  <WKIcons.Search className="w-4 h-4 text-[#353535]" />
                </div>
              </div>
            </div>
          </div>

          {/* New Conversation button */}
          <div className="px-5 py-0 self-stretch w-full flex flex-col items-center justify-center gap-2 relative">
            <div className="flex items-start relative self-stretch w-full">
              <Button className="w-[232px] h-[34px] flex items-center justify-center gap-2 px-3 py-1.5 border border-solid border-[#005B92] bg-white text-[#005B92] rounded-none hover:bg-gray-50">
                <WKIcons.Plus className="w-4 h-4 text-[#005B92]" />
                <span className="font-normal text-sm">New Conversation</span>
              </Button>
            </div>
          </div>

          {/* Empty chat placeholder */}
          <div className="w-full flex-1 pt-4 pb-0 flex flex-col items-center justify-center gap-2 relative">
            <div className="flex flex-col w-[175px] items-center gap-4 relative">
              <WKIcons.ColorfulIcon className="w-28 h-28" />
              <p className="relative w-[170px] text-grayshade-1 text-sm text-center leading-[21px]">
                Your future chats will brighten up this space!
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="w-full bg-white border-r border-graytint5-ededed">
          <div className="flex flex-col items-center justify-end px-4 pt-0 pb-2 relative w-full">
            <Separator className="w-full bg-[#d9d9d9]" />
          </div>

          {/* Navigation links */}
          {navLinks.map((link, index) => (
            <div key={index} className="flex h-10 items-center relative w-full">
              <div className="relative flex-1 grow h-8">
                <div className="absolute w-[228px] top-1.5 left-10 font-link-nav-regular text-grayshade-1 text-[length:var(--link-nav-regular-font-size)] leading-[var(--link-nav-regular-line-height)]">
                  {link.name}
                </div>
                <div className="absolute w-4 h-4 top-2 left-4">
                  {link.icon === "privacy" && <WKIcons.Privacy className="w-4 h-4 text-[#353535]" />}
                  {link.icon === "about" && <WKIcons.About className="w-4 h-4 text-[#353535]" />}
                  {link.icon === "profile" && <WKIcons.User className="w-4 h-4 text-[#353535]" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-col items-start justify-center flex-1 self-stretch grow relative">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 px-4 py-3 relative self-stretch w-full bg-white">
          <div className="flex items-center gap-2 relative flex-1 grow">
            <img
              className="relative w-6 h-6"
              alt="Open wk ai"
              src="https://c.animaapp.com/mdxksposqojnwc/img/open-0400-wk-ai-generate.svg"
            />
            <h1 className="relative w-fit mt-[-1.00px] cch-intelligence-title whitespace-nowrap">
              CCH Axcess™ Intelligence
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 relative mt-[-4.00px] mb-[-4.00px]" />
        </header>

        {/* Main content area */}
        <div className="flex flex-col items-center justify-end gap-5 px-4 py-6 relative flex-1 self-stretch w-full grow bg-white">
          <div className="flex flex-col items-center gap-5 relative flex-1 self-stretch w-full grow">
            {/* Welcome message */}
            <div className="flex flex-col w-[720px] items-start gap-4 relative">
              <div className="flex items-start gap-4 w-full">
                <div className="w-5 h-5 items-center justify-center gap-2.5 flex relative flex-shrink-0">
                  <WKIcons.LargeSparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start gap-2 relative flex-1">
                  <p className="relative self-stretch font-['Fira_Sans'] text-[#353535] text-sm leading-[21px]">
                    Hi, welcome to the CCH Axcess™ Intelligence.
                  </p>
                  <p className="relative self-stretch font-['Fira_Sans'] text-[#353535] text-sm leading-[21px]">
                    Start your conversation by selecting a prompt or typing
                    your question
                  </p>
                </div>
              </div>

              {/* Suggestion cards */}
              <div className="flex flex-wrap w-full items-start gap-4">
                {suggestionCards.map((card, index) => (
                  <Card
                    key={index}
                    className="w-[352px] h-[137px] bg-white rounded-lg shadow-elevation-light-shadow-02"
                  >
                    <CardContent className="p-5">
                      <div className="flex max-w-[680px] items-start gap-2 relative w-full">
                        <div className="flex flex-col items-start gap-3 relative flex-1 grow">
                          <div className="relative self-stretch mt-[-1.00px] [font-family:'Fira_Sans',Helvetica] font-normal text-[#242424] text-sm tracking-[0] leading-[14px]">
                            <span className="font-bold leading-[21px]">
                              {card.title}
                              <br />
                              <br />
                            </span>
                            <span className="leading-[21px]">
                              {card.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="flex flex-col w-[720px] items-start gap-2 relative">
            <div className="flex flex-col items-start justify-center gap-2 px-4 py-3 self-stretch w-full bg-white border border-solid border-[#757575] relative">
              <Input
                className="w-full h-5 font-input-normal-placeholder text-[#474747] text-[length:var(--input-normal-placeholder-font-size)] leading-[var(--input-normal-placeholder-line-height)] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
                placeholder="Ask your assistant a question ..."
              />

              <div className="items-end justify-end self-stretch w-full flex relative">
                <div className="inline-flex flex-wrap items-end justify-end gap-2 relative self-stretch">
                  <div className="inline-flex items-center justify-end relative">
                    <div className="inline-flex items-start relative">
                      <div className="inline-flex items-start gap-2.5 p-3 relative">
                        <WKIcons.PlusCircle className="w-4 h-4 text-[#353535]" />
                      </div>
                    </div>

                    <div className="inline-flex items-start relative">
                      <div className="inline-flex items-start gap-2.5 p-3 relative">
                        <WKIcons.Attach className="w-4 h-4 text-[#353535]" />
                      </div>
                    </div>

                    <div className="inline-flex items-start relative">
                      <div className="inline-flex items-start gap-2.5 p-3 relative">
                        <WKIcons.Send className="w-4 h-4 text-[#353535]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex w-[698px] items-baseline gap-1 relative">
              <p className="text-[#757575] text-xs leading-[18px]">
                The responses are AI generated and might not always be factually
                true. Verifying facts and sources is recommended.
              </p>
              <a
                href="#"
                className="text-blueshade1-005b92 text-xs leading-[16px]"
              >
                See more info
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
