"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownProps {
  options: string[];
  label: string;
  selected: string;
  onSelect: (option: string) => void;
}

function Dropdown({ options, label, selected, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {label && <label className="label-heavy">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-heavy flex justify-between items-center"
      >
        <span className="text-heavy-main font-bold">
          {selected || "Select option"}
        </span>
        <ChevronDown
          size={20}
          className={`text-heavy-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute mt-2 left-0 w-full bg-heavy-card border-2 border-heavy-border rounded-2xl overflow-hidden z-50 shadow-2xl">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="w-full p-4 flex justify-between items-center hover:bg-heavy-surface text-heavy-main transition-colors text-left font-bold border-b border-heavy-border last:border-none"
              >
                {option}
                {selected === option && (
                  <Check size={18} className="text-heavy-teal" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;
