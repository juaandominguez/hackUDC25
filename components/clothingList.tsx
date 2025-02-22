'use client';

import { useState, useEffect } from 'react';
import ClothingCard from '@/components/clothingCard';
import { ClothingItem } from '@/components/clothingCard';

const ClothingList = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch('https://api-sandbox.inditex.com/searchpmpa-sandbox/products?query=', {
            method: 'GET',
            headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJraWQiOiJZMjZSVjltUFc3dkc0bWF4NU80bDBBd2NpSVE9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiczRra2dSbEl4VmJhczdpbmFpNFRKdyIsInN1YiI6Im9hdXRoLW1rcHNib3gtb2F1dGhtZ2FtbGt5eXNvZmN3eW1ycXpzbmJ4cHJvIiwiYXVkaXRUcmFja2luZ0lkIjoiYmMxODIwODItNTlmYy00OTYyLWI5ZTQtMTIyMDg4ODYxMGUxLTExOTg3MzAyNSIsImN1c3RvbSI6eyJjb25zdW1lck9yZ0lkIjoiamF2aWlpZXJtaXNhbl9nbWFpbC5jb20iLCJtYXJrZXRwbGFjZUNvZGUiOiJvcGVuLWRldmVsb3Blci1wb3J0YWwiLCJtYXJrZXRwbGFjZUFwcElkIjoiMjljZjM1ZjItNGQ0NC00NTVmLTkzYzUtNDJjOTY2ZTNmZjQ1In0sImlzcyI6Imh0dHBzOi8vYXV0aC5pbmRpdGV4LmNvbTo0NDMvb3BlbmFtL29hdXRoMi9pdHhpZC9pdHhpZG1wL3NhbmRib3giLCJ0b2tlbk5hbWUiOiJpZF90b2tlbiIsInVzZXJJZCI6Im9hdXRoLW1rcHNib3gtb2F1dGhtZ2FtbGt5eXNvZmN3eW1ycXpzbmJ4cHJvIiwiYXVkIjoib2F1dGgtbWtwc2JveC1vYXV0aG1nYW1sa3l5c29mY3d5bXJxenNuYnhwcm8iLCJpZGVudGl0eVR5cGUiOiJzZXJ2aWNlIiwiYXpwIjoib2F1dGgtbWtwc2JveC1vYXV0aG1nYW1sa3l5c29mY3d5bXJxenNuYnhwcm8iLCJhdXRoX3RpbWUiOjE3NDAxODQ0NjksInNjb3BlIjoibWFya2V0IHRlY2hub2xvZ3kuY2F0YWxvZy5yZWFkIG9wZW5pZCIsInJlYWxtIjoiL2l0eGlkL2l0eGlkbXAvc2FuZGJveCIsInVzZXJUeXBlIjoiZXh0ZXJuYWwiLCJleHAiOjE3NDAxODgwNzEsInRva2VuVHlwZSI6IkpXVFRva2VuIiwiaWF0IjoxNzQwMTg0NDY5LCJhdXRoTGV2ZWwiOiIxIn0.UtiUA7QiGnaWB38lalSYPZYTDr3kTQh4alfeWJ1DdIc9CJfh0x4cR5OfTZIWS7MBbYn45efAcDi3CoiyAqSBeZPHxM-LPIH5znQLEBbZ0RXMA1YEUUjJuVUeg5D19rJJVwg5T75m_X7cubXzHUkj8wRaLk3y5OJnNcRhq4JtMeRrRuq7EaQxEPKvQybvS3-LuaLBc1290t9fjzkH6Ot9ItmXWfzr44sPmQNXCuWkNawQUf3X3NWA4jlhSxgs1E917mzBQ1hNfGxh_gyL7z5k_1ZIxgSNmMNInfrZqswD-ChB0APdodeSfYQmzMoZr8NwaaorTmc7bpPB5fEFT-PLfg`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data)
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
