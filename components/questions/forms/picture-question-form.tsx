"use client";

import React, { useRef } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { Question, ImageAsset } from "@/lib/model/paper";

export function PictureQuestionForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const imageAsset: ImageAsset = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          dataUrl,
          width: 250,
          height: 180,
        };
        onUpdate({ image: imageAsset });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 pt-2">
      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
        Attached Picture / Diagram Image
      </label>

      {question.image ? (
        <div className="relative group rounded-2xl bg-zinc-900 border border-white/10 p-4 flex flex-col items-center justify-center gap-3">
          <img
            src={question.image.dataUrl}
            alt={question.image.name}
            className="max-h-48 object-contain rounded-lg border border-white/5"
          />

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>Width: {question.image.width || 250}px</span>
            <span>Height: {question.image.height || 180}px</span>
          </div>

          <button
            type="button"
            onClick={() => onUpdate({ image: undefined })}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
            title="Remove Image"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-dashed border-white/15 hover:border-emerald-500/40 text-zinc-400 hover:text-zinc-200 transition-all flex flex-col items-center justify-center gap-2 p-4 text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-white/[0.05] group-hover:bg-emerald-500/20 text-zinc-400 group-hover:text-emerald-400 flex items-center justify-center transition-all">
            <Upload size={18} />
          </div>
          <span className="text-xs font-medium">Upload Image / Diagram (PNG, JPG)</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
