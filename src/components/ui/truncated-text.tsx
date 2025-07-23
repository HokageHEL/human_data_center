import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const [showTooltipState, setShowTooltipState] = useState(false);
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

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={cn("truncate", className)}
        style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
        onMouseEnter={() =>
          isTruncated && showTooltip && setShowTooltipState(true)
        }
        onMouseLeave={() => setShowTooltipState(false)}
        title={isTruncated && showTooltip ? text : undefined}
      >
        {text}
      </div>
      {showTooltipState && isTruncated && showTooltip && (
        <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg -top-8 left-0 whitespace-nowrap max-w-xs break-words">
          {text}
        </div>
      )}
    </div>
  );
};
