// src/components/ui/FilterAccordion.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-xs font-bold uppercase tracking-wide">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

export default FilterAccordion;
