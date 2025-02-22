"use client"

import { useState, useEffect } from "react"
import ClothingCard from "@/components/clothingCard"
import type { ClothingItem } from "@/components/clothingCard"

const ClothingList = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClothes = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:3000/api")
        const data = await response.json()
        console.log(data)

        if (Array.isArray(data)) {
          setClothes(data)
        } else if (data.products && Array.isArray(data.products)) {
          setClothes(data.products)
        } else {
          throw new Error("Data is not in the expected format")
        }
      } catch (error) {
        console.error("Error fetching clothes:", error)
        setError("Failed to fetch clothing items. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchClothes()
  }, [])

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (clothes.length === 0) {
    return <div className="text-center">No clothing items found.</div>
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {clothes.map((item) => (
        <ClothingCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ClothingList

