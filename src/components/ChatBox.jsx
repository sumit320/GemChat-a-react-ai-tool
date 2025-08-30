import React, { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { IoCopyOutline } from "react-icons/io5";

const ChatBox = ({ role, text, isLoading }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);

  // Copy AI response
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-style **bold** and *medium* text
  const parseText = (txt) => {
    const lines = txt.split("\n");
    return lines.map((line) => {
      const parts = [];
      const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: "normal",
            text: line.slice(lastIndex, match.index),
          });
        }
        const token = match[0];
        if (token.startsWith("**")) {
          parts.push({ type: "bold", text: token.replace(/\*\*/g, "") });
        } else if (token.startsWith("*")) {
          parts.push({ type: "medium", text: token.replace(/\*/g, "") });
        }
        lastIndex = match.index + token.length;
      }
      if (lastIndex < line.length) {
        parts.push({ type: "normal", text: line.slice(lastIndex) });
      }
      return parts;
    });
  };

  // Ensure parsedText is always an array of arrays
  const parsedText =
    role === "ai"
      ? !isLoading
        ? parseText(text)
        : [[{ type: "normal", text: "💭 AI is thinking..." }]]
      : [[{ type: "normal", text }]];

  return (
    <div
      className={`relative flex ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-3 rounded-2xl shadow-md break-words inline-block min-w-[60px] max-w-[80%] relative
        ${
          role === "user"
            ? "bg-blue-600 text-white animate-slideInRight"
            : isDark
            ? "bg-zinc-700/80 text-zinc-100 animate-slideInLeft"
            : "bg-gray-200 text-gray-900 animate-slideInLeft"
        }`}
      >
        {/* Copy button only for AI when not loading */}
        {role === "ai" && !isLoading && (
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition-all duration-200
              ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white hover:bg-gray-500 cursor-pointer"
              }`}
          >
            {copied ? "✅" : <IoCopyOutline />}
          </button>
        )}

        {/* Chat text */}
        <div className="pr-12">
          {parsedText.map((line, i) => (
            <p
              key={i}
              className={`mb-1 ${
                role === "ai" && isLoading
                  ? "italic text-gray-400 dark:text-zinc-400"
                  : ""
              }`}
            >
              {line.map((part, j) => {
                if (part.type === "bold")
                  return <strong key={j}>{part.text}</strong>;
                if (part.type === "medium")
                  return (
                    <span key={j} className="font-semibold">
                      {part.text}
                    </span>
                  );
                return <span key={j}>{part.text}</span>;
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
