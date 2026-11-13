"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "atd-icons";

export type CheckboxDropdownOption = {
  id: string;
  label: string;
};

type CheckboxDropdownProps = {
  label: string;
  options: CheckboxDropdownOption[];
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};

const CheckboxDropdown = ({
  label,
  options,
  selectedIds,
  onApply,
}: CheckboxDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>(selectedIds);
  const [prevSelectedIds, setPrevSelectedIds] = useState(selectedIds);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen) setPendingIds(selectedIds);
    setIsOpen((prev) => !prev);
  };

  // Keep the checked state in sync when `selectedIds` changes from outside
  // (e.g. a selection chip removed elsewhere) while the dropdown is open —
  // adjusted during render per React's guidance, rather than in an effect.
  if (selectedIds.join(",") !== prevSelectedIds.join(",")) {
    setPrevSelectedIds(selectedIds);
    if (isOpen) setPendingIds(selectedIds);
  }

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleOption = (id: string) => {
    const nextIds = pendingIds.includes(id)
      ? pendingIds.filter((existing) => existing !== id)
      : [...pendingIds, id];
    setPendingIds(nextIds);
    onApply(nextIds);
  };

  if (!options.length) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded border px-4 py-3 text-body-base transition-colors",
          selectedIds.length > 0
            ? "border-primary-light text-text-heading"
            : "border-text-description text-text-placeholder",
        )}
        aria-expanded={isOpen}
      >
        <span className="text-body-base text-text-heading">
          {label}
          {selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
        </span>
        <ChevronDown
          size={16}
          className={clsx("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded border border-border-primary bg-white p-3 shadow-lg">
          <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {options.map((option) => (
              <li key={option.id}>
                <label className="flex cursor-pointer items-center gap-2 text-body-base">
                  <input
                    type="checkbox"
                    checked={pendingIds.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="size-4 accent-primary-light min-w-4"
                  />
                  {option.label}
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 text-body-base font-medium text-primary underline"
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;
