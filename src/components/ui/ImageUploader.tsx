"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  currentUrl: string | null;
  type: "logo" | "banner" | "menu";
  itemId?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: string;
  label?: string;
}

export function ImageUploader({
  currentUrl,
  type,
  itemId,
  onUploadComplete,
  onRemove,
  className = "",
  aspectRatio = "aspect-video",
  label,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo excede el límite de 5 MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      alert("Solo se permiten imágenes (JPG, PNG, WebP, GIF)");
      return;
    }

    // Preview local inmediato
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      if (itemId) formData.append("itemId", itemId);

      setProgress(60);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la imagen");
      }

      setProgress(90);
      const result = await response.json();
      setPreview(result.data.url);
      onUploadComplete(result.data.url);
      setProgress(100);
    } catch (error) {
      console.error("[ImageUploader] Error:", error);
      setPreview(currentUrl);
      alert(error instanceof Error ? error.message : "Error al subir la imagen");
    } finally {
      setIsUploading(false);
      setProgress(0);
      URL.revokeObjectURL(localPreview);
    }
  }, [type, itemId, currentUrl, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset para permitir re-seleccionar el mismo archivo
    e.target.value = "";
  }, [handleUpload]);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-on-surface-variant px-1">
          {label}
        </label>
      )}
      <div
        className={`
          relative rounded-[12px] overflow-hidden border-2 border-dashed transition-all cursor-pointer
          ${aspectRatio}
          ${isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : preview
              ? "border-transparent"
              : "border-outline-variant/40 bg-surface-container-high hover:border-primary/40 hover:bg-primary/5"
          }
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Preview */}
        {preview && !isUploading && (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={preview.startsWith("blob:")}
            />
            <div className="absolute inset-0 bg-surface/0 hover:bg-surface/60 transition-colors group flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <div className="p-2 rounded-full bg-surface-container shadow-lg">
                  <Upload size={18} className="text-primary" />
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      onRemove();
                    }}
                    className="p-2 rounded-full bg-error/90 shadow-lg hover:bg-error transition-colors"
                  >
                    <X size={18} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!preview && !isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-outline">
            <ImagePlus size={28} strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface-variant">
                {isDragging ? "Suelta la imagen aquí" : "Arrastra o haz clic"}
              </p>
              <p className="text-[10px] text-outline mt-0.5">
                JPG, PNG, WebP · Máx 5 MB
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/80 backdrop-blur-sm">
            <Loader2 size={24} className="text-primary animate-spin" />
            <div className="w-32">
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant text-center mt-1.5">
                Procesando...
              </p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
