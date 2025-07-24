"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from '@clerk/nextjs';

// Types
interface Message {
  id: string;
  type: "user" | "ai" | "error";
  content: string;
  timestamp: Date;
  corrections?: string[] | null;
  suggestions?: string[] | null;
  encouragement?: string | null;
  difficulty_level?: string;
}

interface APIResponse {
  message: string;
  corrections?: string[] | null;
  suggestions?: string[] | null;
  difficulty_level: string;
  encouragement?: string | null;
}

interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  route: string;
}

// Navigation Component
const Navigation: React.FC<{
  activeIndex: number;
  onNavigate: (route: string, index: number) => void;
}> = ({ activeIndex, onNavigate }) => {
  const navItems: NavigationItem[] = [
    {
      id: "home",
      icon: "/images/Vector.svg",
      label: "Home",
      route: "/main-page",
    },
    { id: "add", icon: "/images/add.svg", label: "Add", route: "/onboarding" },
    {
      id: "courses",
      icon: "/images/plus.svg",
      label: "Courses",
      route: "/course-page",
    },
    { id: "chat", icon: "/images/chat.svg", label: "Chat", route: "/chat" },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50
                    bg-white/95 backdrop-blur-sm border-t border-white/30
                    md:top-0 md:w-32 md:h-screen md:border-r md:border-t-0"
    >
      <div
        className="flex justify-around items-center py-3
                    md:h-full md:flex-col md:items-center md:justify-start md:py-10"
      >
        {navItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.route, index)}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 p-2 md:p-4 rounded-lg 
                       md:w-full md:mb-8 md:px-4 ${
                         activeIndex === index ? "bg-teal-400/10" : ""
                       }`}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span
              className={`text-xs md:text-sm ${
                activeIndex === index ? "text-teal-400" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Message Component with AI features
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Teraz";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`message ${message.type} mb-4 animate-fadeIn`}>
      <div className="message-content max-w-[70%] p-3 rounded-2xl backdrop-blur-sm border border-white/20">
        <div className="message-text text-sm leading-relaxed break-words">
          {message.content}
        </div>
        
        {/* Show corrections if available */}
        {message.corrections && message.corrections.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-100/20 rounded-lg border border-yellow-200/30">
            <div className="text-xs font-medium text-yellow-300 mb-1">Poprawki:</div>
            <ul className="text-xs text-yellow-200 space-y-1">
              {message.corrections.map((correction, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-yellow-400">•</span>
                  <span>{correction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show suggestions if available */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 p-2 bg-blue-100/20 rounded-lg border border-blue-200/30">
            <div className="text-xs font-medium text-blue-300 mb-1">Sugestie:</div>
            <ul className="text-xs text-blue-200 space-y-1">
              {message.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-400">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show encouragement message */}
        {message.encouragement && (
          <div className="mt-3 p-2 bg-green-100/20 rounded-lg border border-green-200/30">
            <div className="text-xs text-green-200 italic">
              💡 {message.encouragement}
            </div>
          </div>
        )}

        {/* Show difficulty level for AI messages */}
        {message.type === 'ai' && message.difficulty_level && (
          <div className="flex justify-between items-center mt-2">
            <div className="message-time text-xs opacity-70">
              {formatTime(message.timestamp)}
            </div>
            <div className="text-xs bg-white/10 px-2 py-1 rounded-full">
              Poziom: {message.difficulty_level}
            </div>
          </div>
        )}

        {message.type !== 'ai' && (
          <div className="message-time text-xs opacity-70 mt-1">
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Indicator Component
const StatusIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <div
    className={`status-indicator text-xs font-medium px-2 py-1 rounded-xl uppercase tracking-wider ${
      isOnline
        ? "online bg-green-500/10 text-green-500 border border-green-500/30"
        : "offline bg-red-500/10 text-red-500 border border-red-500/30"
    }`}
  >
    {isOnline ? "Online" : "Offline"}
  </div>
);

// Chat Input Component
const ChatInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}> = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="input-container relative">
      <textarea
        ref={textareaRef}
        className="message-input w-full bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl p-4 pr-16 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all duration-200 resize-none min-h-[44px] max-h-[120px]"
        placeholder="Napisz swoją wiadomość..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onInput={adjustTextareaHeight}
        rows={1}
        disabled={disabled}
      />
      <button
        className="send-button absolute right-2 bottom-2 w-10 h-8 rounded-lg bg-gradient-to-r from-teal-400 to-green-500 border-none text-white text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-400/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        onClick={onSend}
        disabled={disabled || !value.trim()}
      >
        <img src="/images/send-horizontal.svg" alt="send" className="w-4 h-4" />
      </button>
    </div>
  );
};

// Offline Message Component
const OfflineMessage: React.FC = () => (
  <div className="offline-message flex flex-col items-center justify-center h-96 text-center p-10">
    <div className="offline-icon w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
    <div className="offline-title text-white text-xl font-semibold mb-2">
      Brak połączenia
    </div>
    <div className="offline-text text-white/70 text-sm">
      Chat AI wymaga połączenia z internetem. Sprawdź połączenie i spróbuj
      ponownie.
    </div>
  </div>
);

// Main Chat Component with API Integration
const ChatPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Cześć! 👋 Jestem Twoim asystentem AI do nauki języka. Mogę pomóc Ci w:
• Konwersacji w języku obcym
• Tłumaczeniu i wyjaśnieniu słów
• Korekcie gramatycznej
• Ćwiczeniach językowych

Jak mogę Ci dzisiaj pomóc?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userSetup, setUserSetup] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Set up user in database on first visit
  useEffect(() => {
    const setupUser = async () => {
      if (isSignedIn && user && !userSetup) {
        try {
          const response = await fetch('/api/user/setup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.emailAddresses[0]?.emailAddress,
              username: user.username || user.firstName || 'user',
            }),
          });
          
          if (response.ok) {
            setUserSetup(true);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
        }
      }
    };

    setupUser();
  }, [isSignedIn, user, userSetup]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isOnline || !isSignedIn) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          context: 'general',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data: APIResponse = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.message,
        timestamp: new Date(),
        corrections: data.corrections,
        suggestions: data.suggestions,
        encouragement: data.encouragement,
        difficulty_level: data.difficulty_level,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "error",
        content: `Wystąpił błąd podczas wysyłania wiadomości: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Spróbuj ponownie.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: `Cześć! 👋 Jestem Twoim asystentem AI do nauki języka. Mogę pomóc Ci w:
• Konwersacji w języku obcym
• Tłumaczeniu i wyjaśnieniu słów
• Korekcie gramatycznej
• Ćwiczeniach językowych

Jak mogę Ci dzisiaj pomóc?`,
        timestamp: new Date(),
      },
    ]);
  };

  // Show sign-in message if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-teal-400/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Zaloguj się</h2>
          <p className="text-white/70">Aby korzystać z czatu AI, musisz się zalogować.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-5 md:p-10 md:pl-48 pb-24 md:pb-32">
      {isOnline ? (
        <>
          <div
            ref={messagesContainerRef}
            className="messages-container flex-1 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 max-h-[calc(100vh-300px)] overflow-y-auto scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) rgba(255,255,255,0.1)",
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="message ai mb-4">
                <div className="message-content max-w-[70%] p-3 rounded-2xl backdrop-blur-sm border border-white/20 bg-white/95 text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Analizuję wiadomość...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={sendMessage}
            disabled={isLoading}
          />

          <div className="chat-actions flex gap-2 mt-4">
            <button
              className="action-button bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-white/20 transition-all duration-200"
              onClick={clearChat}
            >
              Wyczyść chat
            </button>
          </div>
        </>
      ) : (
        <OfflineMessage />
      )}
    </div>
  );
};

// Placeholder components for other pages
const HomePage: React.FC = () => (
  <div className="flex-1 flex items-center justify-center text-white">
    <h1>Home Page</h1>
  </div>
);

const AddPage: React.FC = () => (
  <div className="flex-1 flex items-center justify-center text-white">
    <h1>Add Page</h1>
  </div>
);

const CoursesPage: React.FC = () => (
  <div className="flex-1 flex items-center justify-center text-white">
    <h1>Courses Page</h1>
  </div>
);

// Main App Component
const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(3);
  const [isOnline, setIsOnline] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize client-side state
    setIsClient(true);
    setIsOnline(navigator.onLine);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isClient]);

  const handleNavigation = (route: string, index: number) => {
    setActiveNavIndex(index);
    router.push(route);
  };

  const renderCurrentPage = () => {
    switch (activeNavIndex) {
      case 0:
        return <HomePage />;
      case 1:
        return <AddPage />;
      case 2:
        return <CoursesPage />;
      case 3:
        return <ChatPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div
      className="app-container relative mx-auto min-h-screen flex flex-col font-['Poppins'] bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg.png')" }}
    >
      {/* Background Eclipse */}
      <img
        src="/images/background.svg"
        alt="background eclipse"
        className="eclipse_bg absolute top-0 left-0 w-full h-auto z-0 opacity-30 pointer-events-none"
      />

      {/* Header */}
      <div className="header flex items-center justify-between p-4 md:p-6 md:pl-40 pt-6 md:pt-10 relative z-10">
        <div className="header-content flex items-center gap-4">
          <div className="header-icon w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <div className="header-title text-white text-xl md:text-2xl font-semibold">
              {activeNavIndex === 0 && "Lingaway"}
              {activeNavIndex === 1 && "Dodaj kurs"}
              {activeNavIndex === 2 && "Kursy"}
              {activeNavIndex === 3 && "AI Chat"}
            </div>
            <div className="header-subtitle text-white/70 text-sm">
              {activeNavIndex === 0 && "Platforma nauki języka"}
              {activeNavIndex === 1 && "Dodaj nowe materiały"}
              {activeNavIndex === 2 && "Twoje kursy językowe"}
              {activeNavIndex === 3 && "Asystent nauki języka"}
            </div>
          </div>
        </div>
        <StatusIndicator isOnline={isOnline} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col pb-20 md:pl-32">
        {renderCurrentPage()}
      </div>

      {/* Navigation */}
      <Navigation activeIndex={activeNavIndex} onNavigate={handleNavigation} />

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          display: flex;
          justify-content: flex-end;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          color: white;
        }

        .message.ai {
          display: flex;
          justify-content: flex-start;
        }

        .message.ai .message-content {
          background: rgba(255, 255, 255, 0.95);
          color: #334155;
        }

        .message.error {
          display: flex;
          justify-content: center;
        }

        .message.error .message-content {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default App;