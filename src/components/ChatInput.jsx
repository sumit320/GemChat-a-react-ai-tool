import React from "react";
import { useTheme } from "../Context/ThemeContext";

const ChatInput = ({ value, onChange, onSend, loading }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="sticky bottom-0 px-4 sm:px-8 py-4 mb-3">
      <div
        className={`max-w-3xl mx-auto w-full flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-colors duration-300 ${
          isDark
            ? "bg-zinc-800/90 border border-zinc-700 focus-within:ring-2 focus-within:ring-blue-500"
            : "bg-gray-100/90 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
        }`}
      >
        <textarea
          rows={1}
          value={value}
          onChange={onChange}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())
          }
          placeholder="Ask Gemini anything..."
          disabled={loading}
          className={`flex-1 resize-none border-none outline-none px-2 text-base placeholder:text-gray-400 transition-colors duration-300 ${
            isDark
              ? "bg-transparent text-white placeholder-zinc-400"
              : "bg-transparent text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          onClick={onSend}
          disabled={loading}
          className={`p-3 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
            isDark
              ? "bg-blue-600 hover:bg-blue-500 active:scale-95 text-white disabled:opacity-50"
              : "bg-blue-500 hover:bg-blue-400 active:scale-95 text-white disabled:opacity-50"
          }`}
        >
          <svg
            className="w-5 h-5 -rotate-45 cursor-p"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <p
        className={`text-center mt-2 text-xs italic ${
          isDark ? "text-zinc-400" : "text-gray-500"
        }`}
      >
        ⚠️ AI can make mistakes — verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
