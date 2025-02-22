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
      <main className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto bg-white text-black">
        <h1 className="text-5xl font-bold uppercase tracking-tighter z-10 relative text-center">
          Find Your Match
        </h1>

        <p className="text-center text-lg mt-4 text-gray-600">
          Use the text input below to search for clothes using a URL to an
          image, or upload a photo to find similar clothes.
        </p>

        <div className="w-full flex flex-col gap-4 mt-8">
          <div
            className="border-2 border-dashed border-black rounded-lg p-8 text-center cursor-pointer"
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
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <Image
                  src={selectedImage}
                  alt="Selected product"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <Upload className="h-8 w-8 text-black" />
                <p className="text-black">
                  {isUploading
                    ? "Uploading..."
                    : "Upload a photo to find similar clothes"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Display images below */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {images.length > 0 ? (
            images.map((item: any, index: number) => (
              <div key={index} className="relative w-full h-64 bg-gray-200">
                <Image
                  src={item.imageUrl} // Show image using imageUrl from the API response
                  alt={`Product ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-none"
                />
              </div>
            ))
          ) : (
            <p>No products found. Upload an image or search using a URL.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
