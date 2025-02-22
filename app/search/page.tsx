"use client";
import React, { useState, useRef } from "react";
import { Search, Upload } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/components/navbar";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto bg-white text-black">
        <h1 className="text-5xl font-bold uppercase tracking-tighter z-10 relative text-center">
          Find Your Match
        </h1>

        <p className="text-center text-lg mt-4 text-gray-600">
          Use the text input below to search for clothes using a URL to an
          image, or upload a photo to find similar clothes.
        </p>

        <form onSubmit={handleSearch} className="w-full mt-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products by image URL"
              className="w-full px-6 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 text-black hover:text-white hover:bg-black transition-all"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

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

          {selectedImage && (
            <button
              onClick={() => console.log("Submit image for search")}
              disabled={isUploading}
              className="w-full py-3 px-6 bg-black text-white rounded-lg hover:bg-white hover:text-black border-2 border-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? "Processing..." : "Search with this image"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
