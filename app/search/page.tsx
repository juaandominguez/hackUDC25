"use client";

import React, { useState, useRef } from "react";
import { Upload, Loader2, Search } from "lucide-react"; // Import loading spinner icon
import Image from "next/image";
import Navbar from "@/components/components/navbar";
import ClothingCard, { ClothingItem } from "@/components/clothingCard";

const SearchPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsUploading(true);
    try {
      console.log(searchTerm);
      const response = await fetch(`/api/upload?imageUrl=${searchTerm}`);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: ClothingItem[] = await response.json();
      setClothingItems(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
    console.log("Searching for:", searchTerm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload & scraping
    setIsUploading(true);
    setLoading(true);
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

      const data: ClothingItem[] = await response.json();
      setClothingItems(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <main className="flex flex-col items-center gap-6 p-6 sm:p-8 max-w-4xl mx-auto bg-white text-black">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">
          Find Your Match
        </h1>

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
                  fill
                  alt="Selected product"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <Upload className="h-8 w-8 text-black" />
                <p className="text-black">
                  {isUploading ? "Uploading..." : "Click to upload a photo"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Display Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center w-full col-span-full mt-8">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            <p className="ml-2 text-gray-500 text-lg">Scraping images...</p>
          </div>
        )}

        {/* Display Clothing Cards */}
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-8">
          {clothingItems.length > 0 ? (
            clothingItems.map((item) => (
              <div key={item.id} className="flex justify-center">
                <ClothingCard item={item} />
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-center text-gray-500 col-span-full">
                No products found. Upload an image to search.
              </p>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;