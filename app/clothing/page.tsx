"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import SurpriseCard from "@/components/surpriseCard";
import Navbar from "@/components/components/navbar";
import type { ClothingItem } from "@/components/clothingCard";

const ClothingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClothes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  useEffect(() => {
    const filtered = allClothes.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClothes(filtered);
  }, [searchTerm, allClothes]);

  return (
    <>
      <Navbar />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">
          Find new clothes!
      </h1>
      <main className="container mx-auto px-4 py-8 bg-white text-black min-h-screen">
        
        <form onSubmit={(e) => e.preventDefault()} className="w-full flex justify-center mb-6">
          <div className="relative flex items-center w-full max-w-md border-2 border-black rounded-lg bg-white shadow-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for clothing by name..."
              className="w-full px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="p-2 text-black hover:bg-black hover:text-white transition rounded-r-lg"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center items-center w-full mt-8">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            <p className="ml-2 text-gray-500 text-lg">Loading products...</p>
          </div>
        )}

        {!loading && (
          <div className="mt-10 text-center">
            {filteredClothes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                {filteredClothes.map((item, index) => (
                  <SurpriseCard key={item.id ?? `item-${index}`} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-600 text-center">
                No items found
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default ClothingPage;