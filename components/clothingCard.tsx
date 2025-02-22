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
  image: string;
}

const ClothingCard = ({ item }: { item: ClothingItem }) => {
  const hasImage = Boolean(item.image);

  return (
    <Card className="w-64 h-[400px] shadow-lg overflow-hidden flex flex-col border border-black">
  <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
    {hasImage ? (
      <Image
        src={item.image}
        alt={item.name}
        width={640}
        height={360}
        className="rounded-none object-cover max-h-full"
      />
    ) : (
      <span className="text-2xl font-bold uppercase text-gray-700 text-center p-4">
        No Image Available
      </span>
    )}
  </div>
  <CardContent className="p-4 flex-grow">
    <p className={`uppercase font-semibold truncate ${hasImage ? "text-lg" : "text-2xl"}`}>
      {item.name}
    </p>
    <p className="text-gray-500 mt-2">
      {item.price.value.current} {item.price.currency}
    </p>
  </CardContent>
  <CardFooter className="p-4 flex justify-between gap-2">
    <Link href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block">
      <button className="px-4 py-2 bg-black text-white text-sm font-medium uppercase border border-black hover:bg-white hover:text-black transition">
        View
      </button>
    </Link>
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check this out! ${item.name}`)}&url=${encodeURIComponent(item.link)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium uppercase border border-blue-500 hover:bg-white hover:text-blue-500 transition">
        Share
      </button>
    </a>
  </CardFooter>
</Card>

  )
}

export default ClothingCard;
