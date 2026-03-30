"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={cn("markdown-content prose-sm", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-muted-foreground">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-200 pl-4 italic my-2">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
