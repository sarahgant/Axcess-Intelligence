
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

import { Separator } from "../../components/ui/separator";
import { WKIcons } from "../../components/ui/wk-icon";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  DocumentUploadModal,
  CCHSearchModal,
  PlusButtonDropdown,
  useDocuments,
  type CCHDocument
} from "../../components/document-upload";
import { useConversations, useAIProvider } from "./hooks";
import { logger } from "../../core/logging/logger";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { MessageDebugger } from "../../components/MessageDebugger";
import { AdminDashboard } from "../../components/AdminDashboard";

// Enhanced type definitions for conversation management
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachedDocuments?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  isStreaming?: boolean;
  versions?: string[]; // For regenerated responses
  currentVersion?: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isFavorited: boolean;
}

interface ConversationSection {
  title: string;
  conversations: Conversation[];
  isCollapsed: boolean;
}

const HomeContent = (): JSX.Element => {
  const loggerInstance = logger.component('Home');

  // Document management
  const {
    documents,
    addDocument,
    removeDocument,
    hasDocuments
  } = useDocuments();

  // Use custom hooks for conversation and AI provider management
  const {
    conversations,
    currentConversationId,
    editingMessageId,
    createConversation,
    deleteConversation,
    toggleFavorite,
    addMessage,
    updateMessage,
    deleteMessage,
    submitFeedback,
    setEditingMessageId
  } = useConversations();

  const {
    selectedProvider,
    setSelectedProvider,
    availableProviders,
    isBackendConnected,
    isInitializingAI,
    sendMessage,
    handleProviderChange
  } = useAIProvider();

  // Modal states for document upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCCHSearchModal, setShowCCHSearchModal] = useState(false);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string>('');

  // Admin dashboard state
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Chat state management
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  // Active tools state (array to support multiple tools)
  const [activeTools, setActiveTools] = useState<string[]>([]);

  // Get current conversation and messages
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Refs for functionality
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside for tools dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowToolsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Admin dashboard keyboard shortcut (Ctrl+Alt+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        setShowAdminDashboard(true);
        loggerInstance.info('Admin dashboard opened via keyboard shortcut');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loggerInstance]);

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!inputText && inputRef.current) {
      inputRef.current.style.height = '40px';
    }
  }, [inputText]);



  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            createConversation();
            break;
          case 'l':
            event.preventDefault();
            inputRef.current?.focus();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [createConversation]);

  // Initialize backend connection and AI providers
  useEffect(() => {
    let mounted = true;

    const initializeBackend = async () => {
      try {
        loggerInstance.info('Connecting to secure backend', { component: 'Home' });
        // Backend initialization is now handled by useAIProvider hook

        if (!mounted) return;

        loggerInstance.info('Backend connected successfully', {
          component: 'Home',
          providers: availableProviders.map(p => p.id),
          defaultProvider: selectedProvider
        });
      } catch (error) {
        loggerInstance.error('Failed to connect to backend', {
          component: 'Home',
          error: error instanceof Error ? error.message : String(error)
        });
        // Error handling is now managed by useAIProvider hook
      }
    };

    initializeBackend();

    return () => {
      mounted = false;
    };
  }, [availableProviders, selectedProvider, loggerInstance]);

  // Create new conversation
  const handleNewConversation = useCallback(async () => {
    const newConversation = await createConversation();
    return newConversation.id;
  }, [createConversation]);

  // Enhanced message sending with validation
  const handleSend = async () => {
    console.log('🎬 handleSend called with inputText:', inputText);
    const trimmedText = inputText.trim();
    console.log('📝 trimmedText:', trimmedText, 'isLoading:', isLoading);
    if (!trimmedText || isLoading) {
      console.log('❌ Early return - no text or loading');
      return;
    }

    // Validate input
    if (trimmedText.length > 10000) {
      loggerInstance.warn('Message too long', { length: trimmedText.length });
      return;
    }

    // Check for malicious content
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    if (maliciousPatterns.some(pattern => pattern.test(trimmedText))) {
      loggerInstance.warn('Malicious content detected', { content: trimmedText.substring(0, 100) });
      return;
    }

    try {
      setIsLoading(true);

      // Create conversation if none exists BEFORE clearing input
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = await handleNewConversation();
        console.log('🆕 Created new conversation:', conversationId);

        // Small delay to ensure state updates have propagated
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add user message with explicit conversation ID
      const userMessage: Omit<Message, 'id' | 'timestamp'> = {
        text: trimmedText,
        sender: 'user',
        attachedDocuments: documents.length > 0 ? documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type
        })) : undefined
      };

      const userMessageId = await addMessage(userMessage, conversationId);
      if (!userMessageId) {
        loggerInstance.error('Failed to add user message', { conversationId });
        setIsLoading(false);
        return;
      }

      // Clear input AFTER successfully adding the message
      setInputText('');
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = '40px';
      }

      // Prepare document context for backend
      const documentContext = documents.length > 0 ? documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        content: (doc as any).content || `Document: ${doc.name}`
      })) : undefined;

      // Create AI message with streaming placeholder
      const aiMessage: Omit<Message, 'id' | 'timestamp'> = {
        text: '...',
        sender: 'ai',
        isStreaming: true
      };

      // Capture the message ID returned by addMessage with explicit conversation ID
      const aiMessageId = await addMessage(aiMessage, conversationId);

      if (!aiMessageId) {
        loggerInstance.error('Failed to create AI message');
        setIsLoading(false);
        return;
      }

      // Track accumulated text locally to avoid state race conditions
      let accumulatedText = '';

      // Send to backend API with streaming
      console.log('📡 About to call sendMessage with:', { trimmedText, selectedProvider, aiMessageId });
      await sendMessage(
        trimmedText,
        {
          onStart: (data: any) => {
            loggerInstance.info('Started streaming response', {
              component: 'Home',
              provider: data.provider || selectedProvider,
              conversationId,
              messageId: aiMessageId
            });
            // Reset accumulated text
            accumulatedText = '';
          },
          onToken: async (token: string) => {
            // Update the streaming message with new token
            console.log('📝 Updating message with token:', { messageId: aiMessageId, token, conversationId });
            // Accumulate text locally to avoid race conditions
            accumulatedText += token;
            console.log('📝 Accumulated text:', { accumulatedText: accumulatedText.substring(0, 100) + '...' });
            try {
              await updateMessage(aiMessageId, { text: accumulatedText });
            } catch (error) {
              console.error('Failed to update message during streaming:', error);
            }
          },
          onComplete: async (data: any) => {
            // Mark streaming as complete
            console.log('✅ Marking message as complete:', { messageId: aiMessageId, finalContent: data.content });
            // If we have complete content in the response, use that instead of accumulated text
            try {
              if (data.content && data.content.trim()) {
                await updateMessage(aiMessageId, { text: data.content, isStreaming: false });
              } else {
                await updateMessage(aiMessageId, { isStreaming: false });
              }
            } catch (error) {
              console.error('Failed to finalize message:', error);
            }
            loggerInstance.info('Response complete', {
              component: 'Home',
              provider: data.provider || selectedProvider,
              conversationId,
              messageId: aiMessageId,
              contentLength: data.content?.length || accumulatedText.length
            });
            // Ensure loading state is cleared
            setIsLoading(false);
          },
          onError: (error: Error) => {
            loggerInstance.error('Streaming error', {
              component: 'Home',
              error: error.message,
              conversationId,
              messageId: aiMessageId
            });
            updateMessage(aiMessageId, {
              text: 'Sorry, I encountered an error processing your request. Please try again.',
              isStreaming: false
            });
            // Ensure loading state is cleared on error
            setIsLoading(false);
          }
        },
        documentContext
      );

    } catch (error) {
      loggerInstance.error('Failed to send message', {
        component: 'Home',
        error: error instanceof Error ? error.message : String(error),
        conversationId: currentConversationId
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get document icon and colors based on file type with robust detection
  const getDocumentIconProps = (fileName: string) => {
    // Extract extension and handle edge cases
    const extension = fileName.toLowerCase().split('.').pop() || '';

    // Enhanced file type detection
    const getFileType = (ext: string): string => {
      // Group similar extensions
      if (['pdf'].includes(ext)) return 'pdf';
      if (['xls', 'xlsx', 'xlsm', 'csv'].includes(ext)) return 'excel';
      if (['doc', 'docx', 'docm'].includes(ext)) return 'word';
      if (['ppt', 'pptx', 'pptm'].includes(ext)) return 'powerpoint';
      if (['txt', 'rtf', 'log'].includes(ext)) return 'text';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'photo';
      return 'text'; // fallback
    };

    const fileType = getFileType(extension);

    switch (fileType) {
      case 'pdf':
        return {
          iconPath: '/src/styles/WK Icons/pdf.png',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          iconFilter: 'brightness(0) saturate(100%) invert(13%) sepia(93%) saturate(6188%) hue-rotate(357deg) brightness(97%) contrast(118%)'
        };
      case 'excel':
        return {
          iconPath: '/src/styles/WK Icons/excel.png',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          iconFilter: 'brightness(0) saturate(100%) invert(35%) sepia(79%) saturate(2476%) hue-rotate(90deg) brightness(96%) contrast(106%)'
        };
      case 'word':
        return {
          iconPath: '/src/styles/WK Icons/word.png',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          iconFilter: 'brightness(0) saturate(100%) invert(26%) sepia(84%) saturate(2827%) hue-rotate(206deg) brightness(97%) contrast(98%)'
        };
      case 'powerpoint':
        return {
          iconPath: '/src/styles/WK Icons/powerpoint.png',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          iconFilter: 'brightness(0) saturate(100%) invert(55%) sepia(61%) saturate(5837%) hue-rotate(14deg) brightness(103%) contrast(104%)'
        };
      case 'photo':
        return {
          iconPath: '/src/styles/WK Icons/photo.png',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          iconFilter: 'brightness(0) saturate(100%) invert(55%) sepia(93%) saturate(4746%) hue-rotate(35deg) brightness(93%) contrast(107%)'
        };
      case 'text':
      default:
        return {
          iconPath: '/src/styles/WK Icons/text.png',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          iconFilter: 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)'
        };
    }
  };

  // Generate intelligent AI responses based on CCH Axcess Intelligence capabilities
  const generateIntelligentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Tax Research responses
    if (lowerMessage.includes('tax') || lowerMessage.includes('regulation') || lowerMessage.includes('code')) {
      return `I can help you with tax research using CCH AnswerConnect. For "${userMessage}", I recommend reviewing the relevant tax code sections, recent regulations, and IRS guidance. Would you like me to search for specific provisions or recent updates on this topic?`;
    }

    // Document analysis responses
    if (lowerMessage.includes('document') || lowerMessage.includes('analyze') || lowerMessage.includes('review')) {
      return `I can assist with document analysis and insights extraction. For "${userMessage}", I can help summarize key information, compare documents, validate data, and extract relevant details from tax returns or related documents. Please upload the documents you'd like me to analyze.`;
    }

    // Correspondence drafting
    if (lowerMessage.includes('draft') || lowerMessage.includes('letter') || lowerMessage.includes('correspondence')) {
      return `I can help you draft professional correspondence. For "${userMessage}", I can assist with client communications, document requests, billing messages, or other professional correspondence. What type of message would you like to create?`;
    }

    // CCH Axcess navigation
    if (lowerMessage.includes('navigate') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `I can guide you through CCH Axcess features and provide support. For "${userMessage}", I can help you find specific tools, access user guides, or navigate to the resources you need. What particular area of CCH Axcess would you like assistance with?`;
    }

    // Default intelligent response
    return `Thank you for your question about "${userMessage}". As your CCH Axcess Intelligence assistant, I can help you with tax research, document analysis, correspondence drafting, and system navigation. I have access to comprehensive tax databases, current regulations, and professional tools to support your work. How can I assist you further with this topic?`;
  };



  // Handle prompt card clicks with auto-send
  const handlePromptClick = (title: string) => {
    setInputText(title);
    // Auto-send the prompt after a brief delay
    setTimeout(() => {
      if (!isLoading) {
        handleSend();
      }
    }, 100);
  };

  // Enhanced keyboard handling
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Cmd/Ctrl+Enter as alternative send for accessibility
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  // Document upload handlers
  const handleFileUpload = async (file: File) => {
    try {
      await addDocument(file);
    } catch (error) {
      console.error('File upload failed:', error);
      // Error is already handled by the useDocuments hook
    }
  };

  const handleCCHDocumentAdd = async (cchDocuments: CCHDocument[]) => {
    // Convert CCH documents to regular documents and add them
    // In a real implementation, this would involve API calls
    for (const cchDoc of cchDocuments) {
      // Simulate file creation for CCH documents
      const mockFile = new File(['CCH Document Content'], cchDoc.name, {
        type: 'application/pdf' // Default to PDF for CCH docs
      });

      try {
        await addDocument(mockFile);
      } catch (error) {
        console.error('CCH document add failed:', error);
      }
    }
  };

  // Modal handlers
  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);
  const openCCHSearchModal = () => setShowCCHSearchModal(true);
  const closeCCHSearchModal = () => setShowCCHSearchModal(false);

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
      className="flex w-full h-screen items-start relative bg-white overflow-hidden"
      data-model-id="8:49972"
    >
      {/* Sidebar */}
      <aside className="flex flex-col w-[272px] h-screen items-start justify-between relative bg-white border-r border-graytint5-ededed overflow-hidden">
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
              <Button
                onClick={() => createConversation()}
                className="w-[232px] h-[34px] flex items-center justify-center gap-2 px-3 py-1.5 border border-solid border-[#005B92] bg-white text-[#005B92] rounded-none hover:bg-gray-50"
              >
                <WKIcons.Plus className="w-4 h-4 text-[#005B92]" />
                <span className="font-normal text-sm">New Conversation</span>
              </Button>
            </div>
          </div>

          {/* Simple conversation indicator or empty state */}
          {messages.length > 0 ? (
            <div className="flex-1 w-full p-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <img src="/src/styles/WK Icons/artificial-intelligence.png" alt="" className="w-4 h-4" />
                  <span className="text-sm text-gray-700 font-medium">Active Conversation</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ) : (
            /* Empty chat placeholder */
            <div className="w-full flex-1 pt-4 pb-0 flex flex-col items-center justify-center gap-2 relative">
              <div className="flex flex-col w-[175px] items-center gap-4 relative">
                <WKIcons.ColorfulIcon className="w-28 h-28" />
                <p className="relative w-[170px] text-grayshade-1 text-sm text-center leading-[21px]">
                  Your future chats will brighten up this space!
                </p>
              </div>
            </div>
          )}
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
      <main className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 px-4 py-3 w-full bg-white flex-shrink-0">
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
        <div className="flex flex-col items-center flex-1 bg-white overflow-y-auto">
          <div className="flex flex-col items-center gap-5 flex-1 w-full px-4 py-4">
            {/* Welcome message - only shown when no messages */}
            {messages.length === 0 && (
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
                      className="w-[352px] h-[137px] bg-white rounded-lg shadow-elevation-light-shadow-02 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handlePromptClick(card.title)}
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
            )}

            {/* Professional Messages display area */}
            {messages.length > 0 && (
              <div className="flex flex-col w-[720px] gap-4 pb-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                    style={{
                      marginTop: index > 0 && messages[index - 1].sender === message.sender ? '4px' : '16px'
                    }}
                  >
                    {/* AI Message Layout - Professional Style */}
                    {message.sender === 'ai' && (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <img src="/src/styles/WK Icons/ai-generate.png" alt="" className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                            <MarkdownRenderer
                              content={message.text}
                              className="text-sm leading-relaxed text-gray-800"
                            />
                          </div>

                          {/* Always visible message actions */}
                          <div className="flex items-center gap-1 mt-2 px-1 justify-start">
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Copy message"
                              onClick={async (e) => {
                                console.log('📋 COPY: Button clicked!', { messageId: message.id, sender: message.sender, hasClipboard: !!navigator.clipboard, isSecure: window.isSecureContext });
                                e.preventDefault();
                                e.stopPropagation();

                                // Capture button reference BEFORE async operation
                                const button = e.currentTarget as HTMLButtonElement;
                                console.log('📋 COPY: Captured button:', !!button);

                                try {
                                  // Try modern clipboard API first
                                  if (navigator.clipboard && window.isSecureContext) {
                                    console.log('📋 COPY: Using modern clipboard API');
                                    await navigator.clipboard.writeText(message.text);
                                    console.log('📋 COPY: Modern clipboard success');
                                  } else {
                                    console.log('📋 COPY: Using fallback method');
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = message.text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    const success = document.execCommand('copy');
                                    textArea.remove();
                                    console.log('📋 COPY: Fallback success:', success);
                                  }

                                  // Show brief success feedback
                                  console.log('📋 COPY: Showing success feedback');
                                  if (button) {
                                    const originalTitle = button.getAttribute('title');
                                    const originalBg = button.style.backgroundColor;

                                    // Update tooltip and background
                                    button.setAttribute('title', 'Copied!');
                                    button.style.backgroundColor = '#dcfce7';
                                    button.style.transform = 'scale(1.05)';
                                    console.log('📋 COPY: Applied success styles');

                                    // Reset after 2 seconds
                                    setTimeout(() => {
                                      if (button) {
                                        button.setAttribute('title', originalTitle || 'Copy message');
                                        button.style.backgroundColor = originalBg;
                                        button.style.transform = '';
                                        console.log('📋 COPY: Reset styles');
                                      }
                                    }, 2000);

                                    // Also show a temporary success message
                                    const successMsg = document.createElement('div');
                                    successMsg.textContent = 'Copied to clipboard!';
                                    successMsg.style.cssText = `
                                      position: fixed;
                                      top: 20px;
                                      right: 20px;
                                      background: #4caf50;
                                      color: white;
                                      padding: 8px 16px;
                                      border-radius: 4px;
                                      z-index: 10000;
                                      font-size: 14px;
                                      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                    `;
                                    document.body.appendChild(successMsg);
                                    setTimeout(() => {
                                      if (successMsg.parentNode) {
                                        successMsg.parentNode.removeChild(successMsg);
                                      }
                                    }, 3000);
                                  } else {
                                    console.error('📋 COPY: Button is null!');
                                  }
                                } catch (error) {
                                  console.error('Failed to copy text:', error);
                                  const button = e.currentTarget as HTMLButtonElement;
                                  if (button) {
                                    button.style.backgroundColor = '#fef2f2';
                                    button.setAttribute('title', 'Copy failed');
                                    setTimeout(() => {
                                      if (button) {
                                        button.style.backgroundColor = '';
                                        button.setAttribute('title', 'Copy message');
                                      }
                                    }, 2000);
                                  }
                                }
                              }}
                            >
                              <img src="/src/styles/WK Icons/copy.png" alt="Copy" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                            <button
                              type="button"
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Regenerate response"
                              onClick={async (e) => {
                                console.log('🔄 REGENERATE: Button clicked!', { messageId: message.id, messagesCount: messages.length });
                                e.preventDefault();
                                e.stopPropagation();

                                // Regenerate the AI response
                                const lastUserMessage = messages.slice().reverse().find(m => m.sender === 'user');
                                console.log('🔄 REGENERATE: Found last user message:', lastUserMessage?.id);
                                // Capture button reference BEFORE async operations
                                const button = e.currentTarget as HTMLButtonElement;
                                console.log('🔄 REGENERATE: Captured button:', !!button);

                                if (lastUserMessage) {
                                  if (button) {
                                    button.style.backgroundColor = '#e0f2fe';
                                  }
                                  setIsLoading(true);

                                  try {
                                    // Simulate API delay
                                    console.log('🔄 REGENERATE: Starting regeneration...');
                                    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
                                    const newResponse = generateIntelligentResponse(lastUserMessage.text);
                                    console.log('🔄 REGENERATE: Generated new response:', newResponse.substring(0, 50) + '...');

                                    // Update the specific message
                                    updateMessage(message.id, { text: newResponse, timestamp: new Date() });
                                    console.log('🔄 REGENERATE: Updated message');

                                    // Success feedback
                                    if (button) {
                                      button.style.backgroundColor = '#dcfce7';
                                      button.style.transform = 'scale(1.05)';
                                      setTimeout(() => {
                                        if (button) {
                                          button.style.backgroundColor = '';
                                          button.style.transform = '';
                                        }
                                      }, 2000);
                                    }

                                    // Show success message
                                    const successMsg = document.createElement('div');
                                    successMsg.textContent = 'Response regenerated!';
                                    successMsg.style.cssText = `
                                      position: fixed;
                                      top: 20px;
                                      right: 20px;
                                      background: #2196f3;
                                      color: white;
                                      padding: 8px 16px;
                                      border-radius: 4px;
                                      z-index: 10000;
                                      font-size: 14px;
                                      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                    `;
                                    document.body.appendChild(successMsg);
                                    setTimeout(() => {
                                      if (successMsg.parentNode) {
                                        successMsg.parentNode.removeChild(successMsg);
                                      }
                                    }, 3000);
                                  } catch (error) {
                                    console.error('🔄 REGENERATE: Failed:', error);
                                    if (button) {
                                      button.style.backgroundColor = '#fef2f2';
                                      setTimeout(() => {
                                        if (button) button.style.backgroundColor = '';
                                      }, 1000);
                                    }
                                  } finally {
                                    setIsLoading(false);
                                  }
                                } else {
                                  const button = e.currentTarget as HTMLButtonElement;
                                  if (button) {
                                    button.style.backgroundColor = '#fef2f2';
                                    setTimeout(() => {
                                      if (button) button.style.backgroundColor = '';
                                    }, 1000);
                                  }
                                  alert('No user message found to regenerate from');
                                }
                              }}
                            >
                              <img src="/src/styles/WK Icons/refresh.png" alt="Regenerate" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                            <button
                              type="button"
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Good response"
                              onClick={(e) => {
                                console.log('👍 THUMBS UP: Button clicked!', { messageId: message.id });
                                e.preventDefault();
                                e.stopPropagation();

                                // Add visual feedback for thumbs up
                                const button = e.currentTarget as HTMLButtonElement;
                                if (button) {
                                  button.style.backgroundColor = '#dcfce7';
                                  button.style.transform = 'scale(1.1)';
                                  setTimeout(() => {
                                    if (button) {
                                      button.style.backgroundColor = '';
                                      button.style.transform = '';
                                    }
                                  }, 2000);
                                }

                                // Show feedback message
                                const successMsg = document.createElement('div');
                                successMsg.textContent = 'Thanks for the positive feedback!';
                                successMsg.style.cssText = `
                                  position: fixed;
                                  top: 20px;
                                  right: 20px;
                                  background: #4caf50;
                                  color: white;
                                  padding: 8px 16px;
                                  border-radius: 4px;
                                  z-index: 10000;
                                  font-size: 14px;
                                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                `;
                                document.body.appendChild(successMsg);
                                setTimeout(() => {
                                  if (successMsg.parentNode) {
                                    successMsg.parentNode.removeChild(successMsg);
                                  }
                                }, 3000);
                                loggerInstance.info('Positive feedback submitted', {
                                  component: 'Home',
                                  messageId: message.id,
                                  action: 'feedback_positive'
                                });
                                // Here you would typically send feedback to analytics/backend
                              }}
                            >
                              <img src="/src/styles/WK Icons/thumbs-up.png" alt="Good" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Poor response"
                              onClick={(e) => {
                                console.log('👎 THUMBS DOWN: Button clicked!', { messageId: message.id });
                                e.preventDefault();
                                e.stopPropagation();

                                // Add visual feedback for thumbs down
                                const button = e.currentTarget as HTMLButtonElement;
                                if (button) {
                                  button.style.backgroundColor = '#fef2f2';
                                  button.style.transform = 'scale(1.1)';
                                  setTimeout(() => {
                                    if (button) {
                                      button.style.backgroundColor = '';
                                      button.style.transform = '';
                                    }
                                  }, 2000);
                                }

                                // Show feedback message
                                const feedbackMsg = document.createElement('div');
                                feedbackMsg.textContent = 'Feedback received - we\'ll improve!';
                                feedbackMsg.style.cssText = `
                                  position: fixed;
                                  top: 20px;
                                  right: 20px;
                                  background: #ff9800;
                                  color: white;
                                  padding: 8px 16px;
                                  border-radius: 4px;
                                  z-index: 10000;
                                  font-size: 14px;
                                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                `;
                                document.body.appendChild(feedbackMsg);
                                setTimeout(() => {
                                  if (feedbackMsg.parentNode) {
                                    feedbackMsg.parentNode.removeChild(feedbackMsg);
                                  }
                                }, 3000);

                                // Open feedback modal for additional context
                                setCurrentMessageId(message.id);
                                setShowFeedbackModal(true);

                                loggerInstance.info('Negative feedback submitted', {
                                  component: 'Home',
                                  messageId: message.id,
                                  action: 'feedback_negative'
                                });
                              }}
                            >
                              <img src="/src/styles/WK Icons/thumbs-down.png" alt="Poor" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User Message Layout - Professional Style */}
                    {message.sender === 'user' && (
                      <div className="flex items-start gap-3 max-w-[75%]">
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="bg-[#005B92] px-4 py-3 rounded-lg shadow-sm">
                            <p className="text-sm leading-relaxed text-white whitespace-pre-wrap break-words">{message.text}</p>
                          </div>

                          {/* Attached Documents Display */}
                          {message.attachedDocuments && message.attachedDocuments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-gray-500 px-1">
                                {message.attachedDocuments.length} document{message.attachedDocuments.length !== 1 ? 's' : ''} attached
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {message.attachedDocuments.map((doc) => {
                                  const iconProps = getDocumentIconProps(doc.name);
                                  return (
                                    <div
                                      key={doc.id}
                                      className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs max-w-[140px]"
                                    >
                                      <img
                                        src={iconProps.iconPath}
                                        alt="Document"
                                        className="w-3 h-3"
                                        style={{ filter: iconProps.iconFilter }}
                                      />
                                      <span className="truncate text-gray-700">📎 {doc.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-1 mt-2 px-1 justify-end">
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Edit message"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const button = e.currentTarget as HTMLButtonElement;
                                if (button) {
                                  button.style.backgroundColor = '#e0f2fe';
                                }

                                // Load message into input for editing
                                setInputText(message.text);

                                // Remove this message and all subsequent messages
                                deleteMessage(message.id);

                                // Focus input field after state update
                                setTimeout(() => {
                                  if (inputRef.current) {
                                    inputRef.current.focus();
                                    inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
                                  }
                                }, 100);

                                // Reset button style
                                setTimeout(() => {
                                  if (button) button.style.backgroundColor = '';
                                }, 500);
                              }}
                            >
                              <img src="/src/styles/WK Icons/pencil.png" alt="Edit" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Copy message"
                              onClick={async (e) => {
                                console.log('📋 COPY: Button clicked!', { messageId: message.id, sender: message.sender, hasClipboard: !!navigator.clipboard, isSecure: window.isSecureContext });
                                e.preventDefault();
                                e.stopPropagation();

                                // Capture button reference BEFORE async operation
                                const button = e.currentTarget as HTMLButtonElement;
                                console.log('📋 COPY: Captured button:', !!button);

                                try {
                                  // Try modern clipboard API first
                                  if (navigator.clipboard && window.isSecureContext) {
                                    console.log('📋 COPY: Using modern clipboard API');
                                    await navigator.clipboard.writeText(message.text);
                                    console.log('📋 COPY: Modern clipboard success');
                                  } else {
                                    console.log('📋 COPY: Using fallback method');
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = message.text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    const success = document.execCommand('copy');
                                    textArea.remove();
                                    console.log('📋 COPY: Fallback success:', success);
                                  }

                                  // Show brief success feedback
                                  console.log('📋 COPY: Showing success feedback');
                                  if (button) {
                                    const originalTitle = button.getAttribute('title');
                                    const originalBg = button.style.backgroundColor;

                                    // Update tooltip and background
                                    button.setAttribute('title', 'Copied!');
                                    button.style.backgroundColor = '#dcfce7';
                                    button.style.transform = 'scale(1.05)';
                                    console.log('📋 COPY: Applied success styles');

                                    // Reset after 2 seconds
                                    setTimeout(() => {
                                      if (button) {
                                        button.setAttribute('title', originalTitle || 'Copy message');
                                        button.style.backgroundColor = originalBg;
                                        button.style.transform = '';
                                        console.log('📋 COPY: Reset styles');
                                      }
                                    }, 2000);

                                    // Also show a temporary success message
                                    const successMsg = document.createElement('div');
                                    successMsg.textContent = 'Copied to clipboard!';
                                    successMsg.style.cssText = `
                                      position: fixed;
                                      top: 20px;
                                      right: 20px;
                                      background: #4caf50;
                                      color: white;
                                      padding: 8px 16px;
                                      border-radius: 4px;
                                      z-index: 10000;
                                      font-size: 14px;
                                      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                    `;
                                    document.body.appendChild(successMsg);
                                    setTimeout(() => {
                                      if (successMsg.parentNode) {
                                        successMsg.parentNode.removeChild(successMsg);
                                      }
                                    }, 3000);
                                  } else {
                                    console.error('📋 COPY: Button is null!');
                                  }
                                } catch (error) {
                                  console.error('Failed to copy text:', error);
                                  const button = e.currentTarget as HTMLButtonElement;
                                  if (button) {
                                    button.style.backgroundColor = '#fef2f2';
                                    button.setAttribute('title', 'Copy failed');
                                    setTimeout(() => {
                                      if (button) {
                                        button.style.backgroundColor = '';
                                        button.setAttribute('title', 'Copy message');
                                      }
                                    }, 2000);
                                  }
                                }
                              }}
                            >
                              <img src="/src/styles/WK Icons/copy.png" alt="Copy" className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <img src="/src/styles/WK Icons/user.png" alt="" className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Professional loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        <img src="/src/styles/WK Icons/ai-generate.png" alt="" className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                          <img src="/src/styles/WK Icons/spinner-alt.png" alt="" className="w-4 h-4 animate-spin" />
                          <p className="text-sm text-gray-600">AI is thinking...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>



          {/* Input area */}
          <div className="flex flex-col w-[720px] items-start gap-2 sticky bottom-0 bg-white pt-2 pb-4">
            {/* Document Context Display - Right above input */}
            {hasDocuments && (
              <div className="w-full px-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {documents.map((doc) => {
                    const iconProps = getDocumentIconProps(doc.name);

                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all hover:shadow-sm ${iconProps.bgColor} ${iconProps.borderColor}`}
                      >
                        <img
                          src={iconProps.iconPath}
                          alt="Document icon"
                          className="w-3 h-3"
                          style={{ filter: iconProps.iconFilter }}
                        />
                        <span className={`text-xs max-w-[100px] truncate font-medium ${iconProps.textColor}`}>
                          {doc.name}
                        </span>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors text-xs leading-none"
                          title="Remove document"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-col items-start justify-center gap-2 px-4 py-3 self-stretch w-full bg-white border border-solid border-[#757575] relative">
              <textarea
                ref={inputRef}
                className="w-full min-h-[40px] max-h-[240px] resize-none font-input-normal-placeholder text-[#474747] text-[length:var(--input-normal-placeholder-font-size)] leading-[var(--input-normal-placeholder-line-height)] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pl-0 overflow-y-auto"
                placeholder="Ask your assistant a question ..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 240) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleKeyPress(e as any);
                  }
                }}
                disabled={isLoading}
                rows={1}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  outline: 'none'
                }}
              />

              <div className="items-center justify-between self-stretch w-full flex relative">
                {/* Left side tools */}
                <div className="inline-flex items-center gap-1">
                  <PlusButtonDropdown
                    onUploadClick={openUploadModal}
                    onSearchCCHClick={openCCHSearchModal}
                  />

                  <div className="relative" ref={toolsDropdownRef}>
                    <button
                      onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                      className="inline-flex items-center gap-2 p-2 relative rounded hover:bg-gray-100 transition-all"
                      title={activeTools.length > 0 ? `Active: ${activeTools.join(', ')}` : "Tools & Settings"}
                    >
                      <img
                        src="/src/styles/WK Icons/sliders.png"
                        alt="Tools & Settings"
                        className="w-4 h-4"
                      />
                      {activeTools.length > 0 && (
                        <div className="flex items-center gap-1">
                          {activeTools.slice(0, 2).map((tool, index) => (
                            <span
                              key={tool}
                              className="text-xs text-[#005B92] font-medium bg-[#005B92]/10 px-1.5 py-0.5 rounded-full border border-[#005B92]/20"
                            >
                              {tool}
                            </span>
                          ))}
                          {activeTools.length > 2 && (
                            <span className="text-xs text-[#005B92] font-medium">
                              +{activeTools.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Tools Dropdown */}
                    {showToolsDropdown && (
                      <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[240px]">
                        {/* Search Category */}
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">Search</p>
                        </div>

                        {/* CCH AnswerConnect Search */}
                        <button
                          onClick={() => {
                            const toolName = 'CCH® AnswerConnect';
                            if (activeTools.includes(toolName)) {
                              setActiveTools(activeTools.filter(t => t !== toolName));
                              loggerInstance.info('CCH AnswerConnect Search deactivated', {
                                component: 'Home',
                                action: 'tool_cch_answerconnect_deactivate'
                              });
                            } else {
                              setActiveTools([...activeTools, toolName]);
                              loggerInstance.info('CCH AnswerConnect Search activated', {
                                component: 'Home',
                                action: 'tool_cch_answerconnect_activate'
                              });
                            }
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm transition-colors ${activeTools.includes('CCH® AnswerConnect')
                            ? 'bg-[#005B92]/10 text-[#005B92]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src="/src/styles/WK Icons/globe.png"
                              alt=""
                              className="w-4 h-4"
                            />
                            <span>CCH® AnswerConnect</span>
                          </div>
                          {activeTools.includes('CCH® AnswerConnect') && (
                            <div className="w-2 h-2 bg-[#005B92] rounded-full"></div>
                          )}
                        </button>

                        {/* IRS.gov Search */}
                        <button
                          onClick={() => {
                            const toolName = 'IRS.gov';
                            if (activeTools.includes(toolName)) {
                              setActiveTools(activeTools.filter(t => t !== toolName));
                              loggerInstance.info('IRS.gov Search deactivated', {
                                component: 'Home',
                                action: 'tool_irs_gov_deactivate'
                              });
                            } else {
                              setActiveTools([...activeTools, toolName]);
                              loggerInstance.info('IRS.gov Search activated', {
                                component: 'Home',
                                action: 'tool_irs_gov_activate'
                              });
                            }
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm transition-colors ${activeTools.includes('IRS.gov')
                            ? 'bg-[#005B92]/10 text-[#005B92]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src="/src/styles/WK Icons/shield.png"
                              alt=""
                              className="w-4 h-4"
                            />
                            <span>IRS.gov</span>
                          </div>
                          {activeTools.includes('IRS.gov') && (
                            <div className="w-2 h-2 bg-[#005B92] rounded-full"></div>
                          )}
                        </button>

                        {/* Analysis Category */}
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">Analysis</p>
                        </div>

                        {/* Tax Calculation Tool */}
                        <button
                          onClick={() => {
                            const toolName = 'Tax Calculator';
                            if (activeTools.includes(toolName)) {
                              setActiveTools(activeTools.filter(t => t !== toolName));
                              loggerInstance.info('Tax Calculator deactivated', {
                                component: 'Home',
                                action: 'tool_tax_calculation_deactivate'
                              });
                            } else {
                              setActiveTools([...activeTools, toolName]);
                              loggerInstance.info('Tax Calculator activated', {
                                component: 'Home',
                                action: 'tool_tax_calculation_activate'
                              });
                            }
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm transition-colors rounded-b-lg ${activeTools.includes('Tax Calculator')
                            ? 'bg-[#005B92]/10 text-[#005B92]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src="/src/styles/WK Icons/code.png"
                              alt=""
                              className="w-4 h-4"
                            />
                            <span>Tax Calculator</span>
                          </div>
                          {activeTools.includes('Tax Calculator') && (
                            <div className="w-2 h-2 bg-[#005B92] rounded-full"></div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side send button */}
                <div className="inline-flex items-center">
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputText.trim() || isInitializingAI || !isBackendConnected}
                    title={
                      isInitializingAI
                        ? 'Connecting to backend...'
                        : !isBackendConnected
                          ? 'Backend not connected'
                          : !inputText.trim()
                            ? 'Enter a message to send'
                            : isLoading
                              ? 'Sending message...'
                              : 'Send message'
                    }
                    className={`inline-flex items-center justify-center p-3 relative rounded transition-all disabled:cursor-not-allowed ${inputText.trim() && !isLoading && !isInitializingAI && isBackendConnected
                      ? 'bg-[#005B92] hover:bg-[#004A7A] text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-400'
                      }`}
                  >
                    <img
                      src="/src/styles/WK Icons/send.png"
                      alt="Send"
                      className="w-5 h-5"
                      style={{
                        filter: inputText.trim() && !isLoading
                          ? 'brightness(0) saturate(100%) invert(100%)'
                          : 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)'
                      }}
                    />
                  </button>
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

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={closeUploadModal}
        onFileUpload={handleFileUpload}
        existingDocuments={documents}
      />

      {/* CCH Document Search Modal */}
      <CCHSearchModal
        isOpen={showCCHSearchModal}
        onClose={closeCCHSearchModal}
        onAddDocuments={handleCCHDocumentAdd}
      />

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-[90vw] p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src="/src/styles/WK Icons/thumbs-down.png" alt="" className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-900">Provide Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Help us improve by telling us what went wrong with this response:
            </p>

            <textarea
              placeholder="What could be better about this response? (Optional)"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none text-sm"
              autoFocus
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  loggerInstance.info('Detailed feedback submitted', {
                    component: 'Home',
                    messageId: currentMessageId,
                    action: 'feedback_detailed'
                  });
                  setShowFeedbackModal(false);
                }}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />

    </div>
  );
};

export const Home = (): JSX.Element => {
  return (
    <ScreenErrorBoundary screenName="Home">
      <HomeContent />
    </ScreenErrorBoundary>
  );
};
