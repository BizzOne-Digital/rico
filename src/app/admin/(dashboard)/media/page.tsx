"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { Trash } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { UPLOAD_FOLDERS } from "@/lib/constants";
import { format } from "date-fns";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface StoredFile {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StoredFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (folder) params.set("folder", folder);

    try {
      const res = await fetch(`/api/upload?${params}`);
      const data = await res.json();
      if (data.success) setFiles(data.data);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    // eslint-disable-next-line -- data fetch on mount
    void fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: deleteTarget.folder,
          filename: deleteTarget.filename,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("File deleted");
      setDeleteTarget(null);
      fetchFiles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <>
      <PageHeader title="Media Library" description="Manage uploaded files" />

      <div className="mb-6">
        <Select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          options={[
            { value: "", label: "All Folders" },
            ...UPLOAD_FOLDERS.map((f) => ({ value: f, label: f })),
          ]}
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[#2D6A4F]">Loading media...</div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-[#EDE9DE] bg-white p-8 text-center text-sm text-[#C8C9C7]">
          No files found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="group overflow-hidden rounded-2xl border border-[#EDE9DE] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square bg-[#EDE9DE]">
                {file.mimeType.startsWith("image/") ? (
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#C8C9C7]">
                    {file.mimeType}
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="truncate text-xs font-medium text-[#143D2D]" title={file.filename}>
                  {file.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#C8C9C7]">
                  <span className="uppercase">{file.folder}</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <p className="text-[10px] text-[#C8C9C7]">
                  {format(new Date(file.createdAt), "MMM d, yyyy")}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => copyUrl(file.url)}>
                    Copy URL
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(file)}>
                    <Trash size={16} className="text-[#F05A28]" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete File"
        description={`Delete ${deleteTarget?.filename}? This cannot be undone.`}
        isLoading={deleting}
      />
    </>
  );
}
