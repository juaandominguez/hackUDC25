"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Upload } from "lucide-react";
import Image from "next/image";
import ClothingList from "@/components/clothingList";
import type { ClothingItem } from "@/components/clothingCard"
import ClothingCard from "@/components/clothingCard";

const ClothingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothingItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all clothes once
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();

        if (Array.isArray(data)) {
          setAllClothes(data);
          setFilteredClothes(data);
        } else if (data.products && Array.isArray(data.products)) {
          setAllClothes(data.products);
          setFilteredClothes(data.products);
        } else {
          throw new Error("Data is not in the expected format");
        }
      } catch (error) {
        console.error("Error fetching clothes:", error);
      }
    };
    fetchClothes();
  }, []);

  // Handle search by name
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = allClothes.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClothes(filtered);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Clothing Store</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for clothing by name..."
            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button type="submit" className="absolute right-2 p-2 text-black hover:bg-black hover:text-white transition">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Display Clothing List with Filtered Results */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          {filteredClothes.length > 0 ? "Search Results" : "All Products"}
        </h2>
        {filteredClothes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredClothes.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <ClothingList />
        )}
      </div>
    </main>
  );
};

export default ClothingPage;
