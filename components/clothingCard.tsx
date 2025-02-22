"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"

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
    <Card className="w-64 h-[400px] rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-gray-200">
        <Image src="/placeholder.jpg" alt={item.name} layout="fill" objectFit="cover" className="rounded-t-2xl" />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold truncate">{item.name}</h3>
        <p className="text-gray-500">
          {item.price.value.current} {item.price.currency}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            View
          </Button>
        </a>
        <Button size="sm">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

export default ClothingCard

