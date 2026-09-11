"use client";

import { Trash, Upload } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE } from "@/lib/constants";
import { cn, isUploadUrl, parseUploadUrl } from "@/lib/utils";
import type { UploadFolder } from "@/types";
import Image from "next/image";
import { useId, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

export interface ImageFieldProps {
  value?: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  hint?: string;
  className?: string;
  deleteOnRemove?: boolean;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

const ACCEPT = ALLOWED_MIME_TYPES.join(",");

export async function deleteStoredUpload(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;

  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) return false;
    const data = (await response.json()) as UploadResponse;
    return data.success === true;
  } catch {
    return false;
  }
}

export function ImageField({
  value = "",
  onChange,
  folder,
  label = "Image",
  hint,
  className,
  deleteOnRemove = false,
}: ImageFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Use PNG, JPEG, WebP, or GIF.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error("File too large. Maximum size is 8 MB.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadResponse;

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (deleteOnRemove && value && isUploadUrl(value)) {
      const deleted = await deleteStoredUpload(value);
      if (deleted) {
        toast.success("Image removed from storage");
      }
    }

    onChange("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <label
            htmlFor={inputId}
            className="block text-sm font-medium tracking-wide text-[#143D2D]"
          >
            {label}
          </label>
          {hint ? <p className="mt-1 text-xs text-[#2D6A4F]">{hint}</p> : null}
        </div>
        <span className="text-xs uppercase tracking-[0.08em] text-[#C8C9C7]">
          {folder}
        </span>
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-[#EDE9DE] bg-[#F5F3EC]">
          <div className="relative aspect-[4/3] w-full bg-[#EDE9DE]">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[#EDE9DE] p-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={handleRemove}
            >
              <Trash size={16} />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#C8C9C7] bg-[#F5F3EC] px-6 py-10",
            "text-[#2D6A4F] transition-colors hover:border-[#55C878] hover:bg-[#EDE9DE]/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C878] focus-visible:ring-offset-2",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#143D2D] text-[#F5F3EC]">
            <Upload size={22} />
          </span>
          <span className="text-sm font-medium text-[#143D2D]">
            {uploading ? "Uploading..." : "Upload image"}
          </span>
          <span className="text-xs text-[#C8C9C7]">
            PNG, JPEG, WebP, or GIF up to 8 MB
          </span>
        </button>
      )}
    </div>
  );
}
