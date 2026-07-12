"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateClientLogo } from "@/lib/proposal/actions";
import { removeLogoBackground } from "@/lib/proposal/remove-logo-bg";

export function LogoUpload({
  proposalId,
  initialUrl,
}: {
  proposalId: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setError(null);
    setUploading(true);

    // Auto-strip a baked-in solid background so the mark reads clean on the page.
    // Falls back to the original file if there's no solid background to remove.
    const processed = await removeLogoBackground(file);

    const supabase = createClient();
    const path = `${proposalId}/${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("client-logos")
      .upload(path, processed, { upsert: true, contentType: "image/png" });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("client-logos").getPublicUrl(path);

    try {
      await updateClientLogo(proposalId, data.publicUrl);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save logo");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setUrl(null);
    await updateClientLogo(proposalId, null);
  }

  return (
    <div>
      <label className="label">Client logo</label>
      {url ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL, not a static/local asset next/image can optimize */}
          <img src={url} alt="Client logo" className="h-10 w-auto max-w-[160px] object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="btn-secondary px-2"
            aria-label="Remove logo"
            title="Remove logo"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver ? "border-red bg-red-soft" : "border-border"
          }`}
        >
          <Upload size={20} className="text-text-3" />
          <p className="text-sm text-text-2">
            {uploading ? (
              "Uploading…"
            ) : (
              <>
                Drag &amp; drop a logo, or{" "}
                <label className="cursor-pointer text-red underline">
                  browse
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </label>
              </>
            )}
          </p>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-crit">{error}</p>}
    </div>
  );
}
