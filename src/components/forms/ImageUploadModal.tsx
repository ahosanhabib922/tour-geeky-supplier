"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Check, Image as ImageIcon, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  coverImage?: string;
  onUpdate: (images: string[], coverImage?: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, images, coverImage, onUpdate }: ImageUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      }

      const updatedImages = [...images, ...uploadedUrls];
      
      let newCover = coverImage;
      if (!newCover && updatedImages.length > 0) {
        newCover = updatedImages[0];
      }
      
      onUpdate(updatedImages, newCover);
    } catch (error) {
      alert("Failed to upload some images.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    const updated = images.filter(img => img !== url);
    let newCover = coverImage;
    if (coverImage === url) {
      newCover = updated.length > 0 ? updated[0] : undefined;
    }
    onUpdate(updated, newCover);
  };

  const setAsCover = (url: string) => {
    onUpdate(images, url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border/20 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">Photos</h3>
            <p className="text-[12px] text-brand-light font-medium">Manage your product gallery</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors">
            <X className="w-4 h-4 text-brand-light" />
          </button>
        </div>

        {/* Drag and Drop Area */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 group",
            dragActive ? "border-brand-primary bg-brand-primary/5" : "border-brand-border bg-brand-bg/10 hover:border-brand-primary/30"
          )}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
              <p className="text-[13px] font-bold text-brand-primary animate-pulse">Uploading to Cloudflare R2...</p>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 text-brand-primary opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="text-center">
                <p className="text-[13px] font-bold text-brand-dark">Drag and drop or click to upload</p>
                <p className="text-[11px] text-brand-light font-medium mt-0.5">Recommended: 1920x1080px</p>
              </div>
            </>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-brand-light uppercase tracking-widest">Gallery ({images.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img, idx) => {
                const isCover = coverImage === img;
                return (
                  <div key={idx} className={cn(
                    "group aspect-square rounded-xl bg-brand-bg relative overflow-hidden border transition-all",
                    isCover ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-brand-border/40"
                  )}>
                    <img src={img} className="w-full h-full object-cover" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                      {!isCover && (
                        <button 
                          onClick={() => setAsCover(img)}
                          className="bg-white text-brand-dark px-3 py-1 rounded-full text-[9px] font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                        >
                          Set as Cover
                        </button>
                      )}
                      <button 
                        onClick={() => removeImage(img)}
                        className="p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cover Badge */}
                    {isCover && (
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-brand-primary text-white text-[8px] font-bold uppercase tracking-tight rounded-md shadow-sm flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Cover
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="rounded-full px-8 h-10 text-[13px] font-bold">Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}
