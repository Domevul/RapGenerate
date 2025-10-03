import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  show: boolean;
  title?: string;
  message?: string | React.ReactNode;
  children?: React.ReactNode;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  className?: string;
}

export function Modal({
  show,
  title,
  message,
  children,
  onNext,
  onSkip,
  nextLabel = "次へ",
  skipLabel = "スキップ",
  className,
}: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-lg bg-gray-900 border-2 border-cyan-500 p-6 shadow-xl",
          className
        )}
      >
        {title && (
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
        )}

        {message && (
          <div className="text-white text-lg mb-6 whitespace-pre-line">
            {message}
          </div>
        )}

        {children}

        <div className="flex gap-3 mt-6">
          {onNext && (
            <button
              onClick={onNext}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded transition-colors"
            >
              {nextLabel}
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              {skipLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
