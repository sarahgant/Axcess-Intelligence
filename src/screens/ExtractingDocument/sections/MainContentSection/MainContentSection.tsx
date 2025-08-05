
import { WKIcons } from "../../../../components/ui/wk-icon";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

export const MainContentSection = (): JSX.Element => {
  // Sample data for prompt cards
  const promptCards = [
    {
      title: "CCH Axcess Tax",
      description:
        "Suggest ways to search and gather insights from client tax return data",
    },
    {
      title: "Drafting Correspondence",
      description:
        "Suggest ways to draft client messages for various purposes including document requests & billing",
    },
    {
      title: "CCH Axcess Practice",
      description:
        "Suggest ways to improve practice management and gather billing insights",
    },
    {
      title: "CCH Axcess Workflow",
      description:
        "Suggest ways to improve workflow efficiency, project tracking, and staff scheduling",
    },
    {
      title: "CCH AnswerConnect + CCH Axcess iQ",
      description:
        "Suggest ways to leverage tax research, affects of tax law changes, and tax planning opportunities",
    },
    {
      title: "Navigating CCH Axcess",
      description:
        "Suggest ways to find user support and how-to guidance across CCH Axcess",
    },
  ];

  // Sample data for documents
  const documents = [
    {
      type: "xlsx",
      name: "2024 General Ledger.xlsx",
      client: "Hedge, Juliette",
      clientId: "12345A",
      returnId: "2024:hedge:v1",
    },
    {
      type: "pdf",
      name: "2024 General Ledger.pdf",
      client: "Hedge, Juliette",
      clientId: "12345A",
      returnId: "2024:hedge:v1",
      selected: true,
    },
    {
      type: "xlsx",
      name: "2024 General Ledger.xlsx",
      client: "Wilters, Michael",
      clientId: "67890B",
      returnId: "2024:wilters:v1",
    },
    {
      type: "pdf",
      name: "2024 General Ledger.pdf",
      client: "Wilters, Michael",
      clientId: "67890B",
      returnId: "2024:wilters:v1",
    },
    {
      type: "xlsx",
      name: "2024 General Ledger.xlsx",
      client: "Manes, Jane",
      clientId: "23456C",
      returnId: "2024:manes:v1",
    },
  ];

  return (
    <main className="flex-col items-start justify-center flex-1 self-stretch grow flex relative">
      <header className="flex h-14 items-center gap-4 px-4 py-3 relative self-stretch w-full bg-white">
        <div className="flex items-center gap-2 relative flex-1 grow">
          <WKIcons.LargeSparkles className="w-6 h-6" />
          <h3 className="relative w-fit mt-[-1.00px] cch-intelligence-title whitespace-nowrap">
            CCH Axcess™ Intelligence
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 relative" />
      </header>

      <div className="flex flex-col items-center justify-end gap-5 px-4 py-6 relative flex-1 self-stretch w-full grow bg-white">
        <div className="flex flex-col items-center gap-5 relative flex-1 self-stretch w-full grow">
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
                  Start your conversation by selecting a prompt or typing your
                  question
                </p>
              </div>
            </div>

            <div className="flex flex-wrap w-full items-start gap-4">
              {promptCards.map((card, index) => (
                <Card
                  key={index}
                  className="w-[352px] h-[137px] shadow-elevation-light-shadow-02"
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex flex-col gap-3 mt-[-1.00px]">
                      <div className="[font-family:'Fira_Sans',Helvetica] text-[#242424] text-sm">
                        <span className="font-bold leading-[21px] block mb-4">
                          {card.title}
                        </span>
                        <span className="leading-[21px]">
                          {card.description}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[720px] items-start gap-2 relative">
          <div className="flex flex-col items-start justify-center gap-2 px-4 py-3 self-stretch w-full bg-white border border-solid border-[#757575] relative">
            <Input
              className="border-0 shadow-none p-0 h-5 placeholder:text-[#474747] placeholder:font-input-normal-placeholder"
              placeholder="Ask your assistant a question ..."
            />
            <div className="flex items-end justify-end relative self-stretch w-full">
              <div className="inline-flex flex-wrap items-end justify-end gap-2">
                <div className="inline-flex items-center justify-end">
                  <div className="inline-flex items-start">
                    <div className="p-3 inline-flex items-start gap-2.5">
                      <WKIcons.PlusCircle className="w-4 h-4 text-[#353535]" />
                    </div>
                  </div>
                  <div className="inline-flex items-start">
                    <div className="p-3 inline-flex items-start gap-2.5">
                      <WKIcons.Attach className="w-4 h-4 text-[#353535]" />
                    </div>
                  </div>
                  <div className="inline-flex items-start">
                    <div className="p-3 inline-flex items-start gap-2.5">
                      <WKIcons.Send className="w-4 h-4 text-[#353535]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[698px] items-baseline gap-1 relative">
            <div className="inline-flex items-start gap-2 relative">
              <p className="relative w-fit mt-[-1.00px] font-wk-cg3-st-body-font-size-xs-1-5-normal text-[#757575] text-[length:var(--wk-cg3-st-body-font-size-xs-1-5-normal-font-size)] tracking-[var(--wk-cg3-st-body-font-size-xs-1-5-normal-letter-spacing)] leading-[var(--wk-cg3-st-body-font-size-xs-1-5-normal-line-height)] whitespace-nowrap">
                The responses are AI generated and might not always be factually
                true. Verifying facts and sources is recommended.
              </p>
            </div>
            <div className="inline-flex items-start gap-2 relative mr-[-12.00px]">
              <a
                href="#"
                className="relative w-fit mt-[-1.00px] font-link-micro-micro-link text-[#005b92] text-[length:var(--link-micro-micro-link-font-size)] tracking-[var(--link-micro-micro-link-letter-spacing)] leading-[var(--link-micro-micro-link-line-height)] whitespace-nowrap"
              >
                See more info
              </a>
            </div>
          </div>
        </div>

        {/* Context Dialog */}
        <Dialog defaultOpen={true}>
          <DialogContent className="w-[720px] h-[660px] p-0 border rounded-none shadow-none">
            <div className="flex flex-col w-full h-full">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-lg font-medium">
                  Add CCH Axcess™ context
                </DialogTitle>
              </DialogHeader>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input className="flex-1" placeholder="Search..." />
                  <div className="flex items-center gap-2">
                    <button className="p-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 16V8H21V16H3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 20V16"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 20H16"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                    <button className="p-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <Tabs defaultValue="documents">
                  <TabsList className="mb-4 border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="documents"
                      className="text-blueshade1-005b92 border-b-2 border-blueshade1-005b92 rounded-none data-[state=active]:bg-transparent"
                    >
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="documents" className="mt-0">
                    <div className="flex gap-2 mb-4">
                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Document Type" />
                        </SelectTrigger>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Client" />
                        </SelectTrigger>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Return ID" />
                        </SelectTrigger>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Office" />
                        </SelectTrigger>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Tax Year" />
                        </SelectTrigger>
                      </Select>
                    </div>

                    <h3 className="font-medium mb-2">Documents</h3>

                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className={`p-3 flex items-start gap-3 ${doc.selected ? "bg-bluetint6-f2f8fc" : ""}`}
                        >
                          <div className="w-6 h-6 flex-shrink-0">
                            {doc.type === "xlsx" ? (
                              <WKIcons.Excel className="w-full h-full" />
                            ) : doc.type === "pdf" ? (
                              <WKIcons.PDF className="w-full h-full" />
                            ) : (
                              <WKIcons.Document className="w-full h-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-600">
                              Pulled from CCH Axcess™ Document
                            </p>
                            <p className="text-xs text-gray-600">
                              Client: {doc.client} / Client ID: {doc.clientId} /
                              Return ID: {doc.returnId}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};
