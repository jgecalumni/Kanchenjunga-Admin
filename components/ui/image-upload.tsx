"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageType {
  id?: number;
  url: string;
}

interface ImageUploadProps {
  value: File[]; // New images to upload
  existingImages?: ImageType[]; // Existing images from the server
  onChange: (newImages: File[], existingImages: ImageType[]) => void; // Updated callback
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  value = [],
  existingImages = [],
  onChange,
  maxImages = 4,
  className,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxImages - (value.length + existingImages.length);
    const filesToAdd = files.slice(0, remainingSlots);

    onChange([...value, ...filesToAdd], existingImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeNewImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages, existingImages);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    onChange(value, newExistingImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const totalImages = value.length + existingImages.length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Room Images</Label>
        <span className="text-xs text-muted-foreground">
          {totalImages}/{maxImages} images
        </span>
      </div>

      {/* Image Preview Grid */}
      {(value.length > 0 || existingImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Display existing images */}
          {existingImages.map((image, index) => (
            <div
              key={`existing-${index}`}
              className="relative group aspect-square rounded-lg border border-border overflow-hidden"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${image.url}`}
                alt={`Existing room image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExistingImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {/* Display new images */}
          {value.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative group aspect-square rounded-lg border border-border overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`New room image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeNewImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {totalImages < maxImages && (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Click to upload</span>{" "}
              or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </div>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}