import React from "react";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  className = "",
  highlightClassName = "bg-yellow-200 dark:bg-yellow-800 px-1 rounded",
}) => {
  if (!text || !searchTerm || searchTerm.trim() === "") {
    return <span className={className}>{text}</span>;
  }

  // For hashtag search, only highlight the specific hashtag
  const searchPattern = searchTerm.startsWith("#")
    ? searchTerm // Exact hashtag match
    : searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special characters

  // Create regex with case insensitive flag
  const regex = new RegExp(`(${searchPattern})`, "gi");

  // Split the text by regex matches
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMatch =
          part.toLowerCase() === searchTerm.toLowerCase() ||
          (searchTerm.startsWith("#") && part === searchTerm);

        return isMatch ? (
          <mark key={i} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </span>
  );
};
