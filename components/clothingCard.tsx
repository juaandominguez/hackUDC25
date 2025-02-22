'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';

export type ClothingItem = {
  id: string;
  name: string;
  price: {
    currency: string;
    value: {
      current: number;
      original?: number | null;
    };
  };
  link: string;
  brand: string;
};

const ClothingCard = ({ item }: { item: ClothingItem }) => {
  return (
    <Card className="w-72 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full h-80 bg-gray-200">
        {/* Placeholder image since API doesn't provide one */}
        <Image
          src="/placeholder.jpg"
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-500">{item.price.value.current} {item.price.currency}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">View</Button>
        </a>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ClothingCard;
