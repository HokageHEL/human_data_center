import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  maxWidth?: number;
  className?: string;
  showTooltip?: boolean;
  truncationThreshold?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxWidth,
  className,
  showTooltip = true,
  truncationThreshold = 5,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        const overflow = element.scrollWidth - element.clientWidth;
        setIsTruncated(overflow > truncationThreshold);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [text, truncationThreshold]);

  const content = (
    <div
      ref={textRef}
      className={cn("truncate", className)}
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
    >
      {text}
    </div>
  );

  if (!showTooltip || !isTruncated) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
