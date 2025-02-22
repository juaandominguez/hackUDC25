"use client";
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/components/navbar";

const SearchPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Prepare for upload
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      setImages(data); // Set the response images to the state
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <main className="flex flex-col items-center gap-6 p-6 sm:p-8 max-w-4xl mx-auto bg-white text-black">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">
          Find Your Match
        </h1>

        <p className="text-center text-base sm:text-lg mt-2 text-gray-600">
          Upload a photo to find similar clothes.
        </p>

        {/* Upload Box */}
        <div className="w-full flex flex-col gap-4 mt-4">
          <div
            className="border-2 border-dashed border-black rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                <Image
                  src={selectedImage}
                  alt="Selected product"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <Upload className="h-8 w-8 text-black" />
                <p className="text-black">
                  {isUploading
                    ? "Uploading..."
                    : "Click to upload a photo"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Display Images */}
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {images.length > 0 ? (
            images.map((item: any, index: number) => (
              <div key={index} className="relative w-full aspect-square bg-gray-200">
                <Image
                  src={item.imageUrl}
                  alt={`Product ${index + 1}`}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="rounded-md object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No products found. Upload an image to search.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
