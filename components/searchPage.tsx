"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Search, Upload } from "lucide-react"
import Image from "next/image"
import ClothingCard, { type ClothingItem } from "./clothingCard"

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<ClothingItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Prepare for upload
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      const uploadData = await uploadResponse.json()
      console.log("Upload successful:", uploadData)

      // Perform visual search
      const searchResponse = await fetch("/api/vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: uploadData.url }),
      })

      if (!searchResponse.ok) {
        throw new Error("Visual search failed")
      }

      const searchData = await searchResponse.json()
      setSimilarProducts(searchData.products || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle text search logic here
    console.log("Searching for:", searchTerm)
  }

  return (
    <main className="flex flex-col items-center gap-8 p-8 max-w-6xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute right-2 p-2 text-gray-500 hover:text-gray-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Image Upload Section */}
      <div className="w-full flex flex-col gap-4">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          {selectedImage ? (
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <Image src={selectedImage || "/placeholder.svg"} alt="Selected product" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <Upload className="h-8 w-8 text-gray-500" />
              <p className="text-gray-500">{isUploading ? "Uploading..." : "Upload a product image"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ClothingCard key={product.id} item={product} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

export default SearchPage

