"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
};

export function NeoSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 neo-input flex items-center justify-between gap-2 bg-yellow-300 dark:bg-yellow-400 text-black font-extrabold text-xs cursor-pointer select-none"
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
              {selectedOption.sublabel && (
                <span className="opacity-75 font-semibold text-[11px]">
                  ({selectedOption.sublabel})
                </span>
              )}
            </>
          ) : (
            <span className="opacity-60">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full z-50 neo-box-lg p-1.5 bg-white dark:bg-zinc-900 shadow-neoLg max-h-64 overflow-y-auto space-y-1 animate-fade-in-up">
          {options.map((opt) => {
            const isSelected = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border-2 ${
                  isSelected
                    ? "bg-yellow-300 dark:bg-yellow-400 text-black border-black shadow-neoSm"
                    : "border-transparent text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="opacity-65 text-[10px] font-semibold">
                      ({opt.sublabel})
                    </span>
                  )}
                </div>

                {isSelected && <Check size={14} className="shrink-0 text-black" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
