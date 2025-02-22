"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import Link from "next/link"

export type ClothingItem = {
  id: string
  name: string
  price: {
    currency: string
    value: {
      current: number
      original?: number | null
    }
  }
  link: string
  brand: string
}

const ClothingCard = ({ item }: { item: ClothingItem }) => {
  return (
    <Card className="w-64 h-[400px] shadow-lg overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-xl border border-black">
      <Link href={item.link} className="flex flex-col h-full">
        <div className="relative w-full h-48 bg-gray-200">
          <Image src="/placeholder.jpg" alt={item.name} layout="fill" objectFit="cover" />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-semibold truncate uppercase">{item.name}</h3>
          <p className="text-gray-500 mt-2">
            {item.price.value.current} {item.price.currency}
          </p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between">
          <button
            className="px-4 py-2 bg-black text-white text-sm font-medium uppercase border border-black hover:bg-white hover:text-black transition"
            onClick={(e) => e.preventDefault()}
          >
            View
          </button>
          <button
            className="px-4 py-2 bg-black text-white text-sm font-medium uppercase border border-black hover:bg-white hover:text-black transition"
            onClick={(e) => e.preventDefault()}
          >
            Add to Cart
          </button>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default ClothingCard

