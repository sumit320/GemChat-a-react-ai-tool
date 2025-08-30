import React from "react";
import { useTheme } from "../Context/ThemeContext";
import { MdDelete, MdClose } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

const SideBar = ({
  chats = [],
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onCloseSidebar,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col h-full p-4 transition-colors duration-500 ${
        isDark ? "bg-zinc-900/95 text-white" : "bg-white text-black"
      }`}
    >
      {/* Sticky Header + New Chat */}
      <div className="sticky top-0 z-20 pt-2 pb-4 bg-inherit">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-center flex-1">⚡GemChat</h1>
          {onCloseSidebar && (
            <button
              onClick={onCloseSidebar}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors ml-2"
            >
              <MdClose size={24} />
            </button>
          )}
        </div>

        <div className="mb-4">
          <button
            onClick={onNewChat}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm transition-colors w-full justify-center cursor-pointer"
          >
            <IoIosAddCircleOutline /> New Chat
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-2 mt-2">
        {chats.length === 0 ? (
          <p
            className={`text-center text-xs ${
              isDark ? "text-zinc-500" : "text-gray-400"
            }`}
          >
            No chats yet.
          </p>
        ) : (
          chats.map((chat) => {
            const messages = chat.messages || [];
            const title = messages[0]?.text?.slice(0, 20) || "New Chat";
            const isActive = chat.id === currentChatId;

            return (
              <div
                key={chat.id}
                className="flex justify-between items-center w-full"
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-500/30 font-semibold"
                      : "hover:bg-blue-500/20"
                  }`}
                >
                  {title}
                  {messages.length > 1 && (
                    <span className="text-xs text-gray-400 ml-2">
                      ({messages.length})
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onDeleteChat(chat.id)}
                  className="ml-2 text-red-500 hover:text-red-400 text-sm px-1 py-0.5 rounded transition-colors cursor-pointer"
                  title="Delete Chat"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <p
        className={`text-xs text-center mt-auto ${
          isDark ? "text-zinc-500" : "text-gray-400"
        }`}
      >
        Responsive & AI-powered chat
      </p>
    </div>
  );
};

export default SideBar;
