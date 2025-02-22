'use client';

import { useState, useEffect } from 'react';
import ClothingCard from '@/components/clothingCard';
import { ClothingItem } from '@/components/clothingCard';

const ClothingList = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch('BASE_URL/products?query=wool%20sweater', {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setClothes(data);
      } catch (error) {
        console.error('Error fetching clothes:', error);
      }
    };
    fetchClothes();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {clothes.map((item) => (
        <ClothingCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ClothingList;
