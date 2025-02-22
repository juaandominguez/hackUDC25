"use client";
import ClothingCard, { ClothingItem } from '@/components/clothingCard';
import Navbar from '@/components/components/navbar';
import { createClient } from '@/utils/supabase/client'
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react'

const FavoritosPage = () => {
    const supabase = createClient();
    const [session, setSession] = useState<Session | null>(null)
    const [data, setData] = useState<ClothingItem[] | null>([])
    useEffect(() => {

        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
          };
         
          
        fetchSession();
         const fetchLikesData = async () => {
                // const { data, error } = await supabase
                // .from('products')
                // .select('liked_urls')
                // .eq('id', session?.user.id);

            const data: ClothingItem[] = [
                {
                  id: "1",
                  name: "Denim Jacket",
                  price: {
                    currency: "USD",
                    value: {
                      current: 59.99,
                      original: 79.99,
                    },
                  },
                  link: "https://example.com/denim-jacket",
                  brand: "Levi's",
                },
                {
                  id: "2",
                  name: "Classic White Sneakers",
                  price: {
                    currency: "USD",
                    value: {
                      current: 89.99,
                    },
                  },
                  link: "https://example.com/white-sneakers",
                  brand: "Nike",
                },
                {
                  id: "3",
                  name: "Cotton Hoodie",
                  price: {
                    currency: "USD",
                    value: {
                      current: 49.99,
                      original: 59.99,
                    },
                  },
                  link: "https://example.com/cotton-hoodie",
                  brand: "Adidas",
                },
                {
                  id: "4",
                  name: "Slim Fit Jeans",
                  price: {
                    currency: "USD",
                    value: {
                      current: 69.99,
                    },
                  },
                  link: "https://example.com/slim-fit-jeans",
                  brand: "Wrangler",
                },
                {
                  id: "5",
                  name: "Leather Belt",
                  price: {
                    currency: "USD",
                    value: {
                      current: 29.99,
                    },
                  },
                  link: "https://example.com/leather-belt",
                  brand: "Gucci",
                },
              ];
              
            setData(data);
            }
            fetchLikesData();


        }, []) 

    
    return (
        <div className="w-full">
      <Navbar />
      <main className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto bg-white text-black">
        <h1 className="text-5xl font-bold uppercase tracking-tighter z-10 relative text-center">
          Favourites
        </h1>
        <p className="text-center text-lg mt-4 text-gray-600">
          A recomendation made just for you
        </p>

        <div className="w-full flex flex-col gap-4 mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {data?.map((item, index) => (
              <ClothingCard key={item.id ?? `item-${index}`} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
    );
}

export default FavoritosPage;