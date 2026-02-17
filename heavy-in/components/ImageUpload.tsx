"use client";

import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploadProps {
  image: string | null;
  setImage: (img: string | null) => void;
}

export default function ImageUpload({ image, setImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid gap-2">
      <div 
        onClick={() => !image && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center h-56 border-2 border-dashed border-heavy-border rounded-3xl bg-heavy-card transition-all overflow-hidden group ${!image ? 'cursor-pointer hover:border-heavy-teal/50' : ''}`}
      >
        {image ? (
          <>
            <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-start justify-end p-4">
              <button 
                onClick={removeImage}
                className="bg-heavy-coral p-3 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-heavy-teal mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <span className="text-heavy-muted font-black uppercase text-[10px] tracking-widest">
              Upload cover photo
            </span>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange} 
        />
      </div>
    </div>
  );
}