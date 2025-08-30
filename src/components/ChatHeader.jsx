import React from "react";
import { useTheme } from "../Context/ThemeContext";
import { HiMenu } from "react-icons/hi";

const ChatHeader = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b transition-colors duration-500 ${
        isDark
          ? "bg-zinc-900/90 border-zinc-700 text-white"
          : "bg-white border-gray-300 text-gray-900"
      }`}
    >
      {/* Left: Hamburger menu (mobile only) */}
      <div className="flex items-center">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="sm:hidden mr-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <HiMenu size={24} />
          </button>
        )}
      </div>

      {/* Center: Gemini AI Chat */}
      <h2 className="flex-1 text-center text-4xl font-bold">GemChat</h2>

      {/* Right: Theme toggle */}
      <div className="flex items-center gap-2">
        <span
          className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}
        >
          ☀️
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform duration-300" />
        </label>
        <span
          className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}
        >
          🌙
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
