"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Upload } from "lucide-react";
import Image from "next/image";
import ClothingList from "@/components/clothingList";
import type { ClothingItem } from "@/components/clothingCard"
import ClothingCard from "@/components/clothingCard";
import Navbar from "@/components/components/navbar";

const ClothingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothingItem[]>([]);

  // Fetch all clothes once
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`);
        const data = await response.json();
        console.log(data);
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
  };

  // Add real-time filtering
  useEffect(() => {
    const filtered = allClothes.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClothes(filtered);
  }, [searchTerm, allClothes]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full flex justify-center mb-6">
          <div className="relative flex items-center w-[400px] border-2 border-black rounded-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for clothing by name..."
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-0"
              style={{ width: "350px" }}
            />
            <button
              type="submit"
              className="p-2 text-black hover:bg-black hover:text-white transition"
            >
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
              {filteredClothes.map((item, index) => (
                <ClothingCard key={item.id ?? `item-${index}`} item={item} />
              ))}
            </div>
          ) : (
          <p className="text-lg font-medium text-gray-600 text-center">
            No items found
          </p>
          )}
        </div>
      </main>
    </>
  );
};

export default ClothingPage;
