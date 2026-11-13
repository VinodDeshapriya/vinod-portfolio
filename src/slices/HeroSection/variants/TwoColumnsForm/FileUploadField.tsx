"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import CloudUpload from "atd-icons/dist/CloudUpload";
import DocumentAttach from "atd-icons/dist/DocumentAttach";
import Close from "atd-icons/dist/Close";
import {
  MAX_FILES,
  MAX_TOTAL_SIZE_BYTES,
  MAX_TOTAL_SIZE_MB,
} from "@/app/api/send-mail/fileLimits";

type SelectedFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

interface FileUploadFieldProps {
  onFilesChange: (files: File[]) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/**
 * "Upload Files" button (or drag & drop) with a list of the chosen files.
 * Ported from the bright-choice Contact form, minus its react-dropzone
 * dependency: a hidden native file input plus drag events does the same job.
 * The limits come from the same file the /api/send-mail route enforces.
 */
export default function FileUploadField({
  onFilesChange,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const selectedFilesRef = useRef(selectedFiles);

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach((entry) => {
        if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      });
    };
  }, []);

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;

      setFormError(null);

      if (selectedFiles.length + incoming.length > MAX_FILES) {
        setFormError(`You can upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      const currentTotal = selectedFiles.reduce(
        (sum, entry) => sum + entry.file.size,
        0,
      );
      const addedTotal = incoming.reduce((sum, file) => sum + file.size, 0);
      if (currentTotal + addedTotal > MAX_TOTAL_SIZE_BYTES) {
        setFormError(
          `Total file size exceeds the ${MAX_TOTAL_SIZE_MB}MB limit.`,
        );
        return;
      }

      const additions: SelectedFile[] = incoming.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      const next = [...selectedFiles, ...additions];
      setSelectedFiles(next);
      onFilesChange(next.map((entry) => entry.file));
    },
    [selectedFiles, onFilesChange],
  );

  const removeFile = (id: string) => {
    const target = selectedFiles.find((entry) => entry.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);

    const next = selectedFiles.filter((entry) => entry.id !== id);
    setSelectedFiles(next);
    setFormError(null);
    onFilesChange(next.map((entry) => entry.file));
  };

  const isFull = selectedFiles.length >= MAX_FILES;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isFull) setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsDragActive(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (!isFull) addFiles(Array.from(e.dataTransfer.files));
        }}
        className={clsx("rounded outline-offset-4 transition-opacity", {
          "opacity-50": isFull,
          "outline-2 outline-primary-light": isDragActive,
        })}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          tabIndex={-1}
          aria-hidden="true"
          disabled={isFull}
          className="sr-only"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            // allow picking the same file again after removing it
            e.target.value = "";
          }}
        />
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isFull}
            className="text-body-small flex h-12.5 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-secondary-dark bg-secondary-dark px-4 text-white transition-colors hover:bg-black/85 disabled:cursor-not-allowed min-w-[221px]"
          >
            <CloudUpload size={18} />
            Upload Files
          </button>
          <span className="text-[12px] leading-[20px] md:text-[16px] md:leading-[24px] text-text-description">
            {isFull
              ? `Maximum ${MAX_FILES} files added`
              : `Max. ${MAX_FILES} files & ${MAX_TOTAL_SIZE_MB}MB`}
          </span>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="mt-3 flex flex-col items-start gap-3">
          {selectedFiles.map((entry) => (
            <li
              key={entry.id}
              className="relative flex w-full items-center gap-2 rounded-[7px] border border-border-primary bg-white p-2 text-body-small"
            >
              {entry.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.previewUrl}
                  alt={entry.file.name}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <DocumentAttach
                  size={24}
                  className="shrink-0 text-text-inactive"
                />
              )}
              <span className="flex flex-1 flex-col overflow-hidden leading-tight">
                <span className="w-full truncate">{entry.file.name}</span>
                <span className="text-text-placeholder">
                  {formatFileSize(entry.file.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => removeFile(entry.id)}
                aria-label={`Remove ${entry.file.name}`}
                className="ml-1 shrink-0 cursor-pointer rounded-full bg-offwhite-2 p-1 text-text-inactive transition-colors hover:text-primary-light"
              >
                <Close size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {formError && (
        <p className="mt-1 text-body-small text-red-500" role="alert">
          {formError}
        </p>
      )}
    </div>
  );
}
