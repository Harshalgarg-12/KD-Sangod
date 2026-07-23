"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Upload, X } from "lucide-react";

function makePreview(file) {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export default function BillUploader({ onChange }) {
  const [previews, setPreviews] = useState([]);
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setPreviews((prev) => [...prev, ...imageFiles.map(makePreview)]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    multiple: true,
    noClick: false,
  });

  useEffect(() => {
    onChange?.(previews.map((p) => p.file));
  }, [previews, onChange]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  function removePreview(id) {
    setPreviews((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-slate-300 bg-white/50 hover:border-primary/60 hover:bg-primary/5 dark:border-slate-600 dark:bg-slate-800/40"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isDragActive ? (
            <Upload className="h-6 w-6" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
          {isDragActive
            ? "Drop bill photos here"
            : "Drag & drop bill photos"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          or click to browse · PNG, JPG, WEBP
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Preview only — files stay on your device (no upload)
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-600 dark:bg-slate-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePreview(item.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-danger text-white shadow-md transition hover:bg-red-600"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
              <p className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-2 py-1 text-[10px] text-white">
                {item.file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
