import { useState, useRef, useEffect } from "react";
import ChatHeader from "../components/ChatHeader";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import SideBar from "../components/SideBar";
import { askGemini } from "../api/gemini";
import { useTheme } from "../Context/ThemeContext";
import React from "react";
export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chats from localStorage
  useEffect(() => {
    const storedChats = JSON.parse(
      localStorage.getItem("geminiChats") || "null"
    );
    if (storedChats && storedChats.length > 0) {
      setChats(storedChats);
      setCurrentChatId(storedChats[0].id);
    } else {
      const firstChat = {
        id: Date.now(),
        messages: [
          {
            role: "ai",
            text: "Hello! I’m Gemini, your AI assistant. How can I help you today?",
          },
        ],
      };
      setChats([firstChat]);
      setCurrentChatId(firstChat.id);
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0)
      localStorage.setItem("geminiChats", JSON.stringify(chats));
  }, [chats]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading, currentChatId]);

  const currentChat = chats.find((c) => c.id === currentChatId) || {
    messages: [],
  };

  const handleNewChat = () => {
    const newChat = { id: Date.now(), messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false); // close sidebar on mobile
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
    setIsSidebarOpen(false); // close sidebar on mobile
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (id === currentChatId) {
      const nextChat = chats.filter((chat) => chat.id !== id)[0];
      setCurrentChatId(nextChat ? nextChat.id : null);
    }
  };

  const handleSend = async () => {
    if (!question.trim() || !currentChatId) return;

    // Save current question and clear input immediately
    const userQuestion = question;
    setQuestion("");

    // Add user's message
    const updatedMessages = [
      ...currentChat.messages,
      { role: "user", text: userQuestion },
    ];
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessages }
          : chat
      )
    );

    // Call AI
    setLoading(true);
    const answer = await askGemini(userQuestion);

    // Add AI response
    const updatedMessagesWithAI = [
      ...updatedMessages,
      { role: "ai", text: answer },
    ];
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessagesWithAI }
          : chat
      )
    );

    setLoading(false);
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-5 min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-black"
      }`}
    >
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex sm:flex-col col-span-1 border-r border-gray-300 dark:border-zinc-700 sticky top-0 h-screen">
        <SideBar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-transform transform sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`relative z-50 h-full w-64 shadow-xl ${
            isDark ? "bg-zinc-900/95 text-white" : "bg-white text-black"
          }`}
        >
          <SideBar
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Chat Area */}
      <div className="col-span-1 sm:col-span-4 flex flex-col">
        <ChatHeader onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Main interactive text */}
        <div className="px-4 sm:px-8 py-4 text-center text-sm sm:text-base text-gray-500 dark:text-zinc-400">
          💬 Start a conversation with Gemini AI! Ask questions, get summaries,
          or explore ideas instantly.
        </div>

        {/* Chat messages container */}
        <div
          className={`flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-4 ${
            "h-[60vh] sm:h-auto" // mobile: 60% of viewport height, desktop auto
          }`}
        >
          {currentChat.messages.map((msg, i) => (
            <ChatBox key={i} role={msg.role} text={msg.text} />
          ))}
          {loading && (
            <ChatBox role="ai" text="AI is thinking..." isLoading={true} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
