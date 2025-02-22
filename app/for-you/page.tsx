"use client";
import { Button } from "@/components/components/buttonS";
import Navbar from "@/components/components/navbar";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const ForYouPage = () => {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();
  }, [supabase]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from("products")
          .select("may_like, may_like_photos")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching likes:", error);
        } else {
          setData(data);
        }
      }
    };

    fetchLikes();
  }, [session, supabase]);

  return (
    <div className="w-full">
      <Navbar />
      <main className="flex flex-col items-center gap-6 p-6 sm:p-8 max-w-4xl mx-auto bg-white text-black">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">
          For you
        </h1>
        <p className="text-center text-base sm:text-lg mt-2 text-gray-600">
          A recommendation made just for you
        </p>

        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-8">
          {data && data.length > 0 && data[0]?.may_like_photos?.map((item: any, index: number) => {
            try {
              const imageUrl = JSON.parse(item).imageUrl;
              const productUrl = data[0]?.may_like?.[index] || "#";

              return (
                <div key={index} className="flex justify-center">
                  <div className="bg-white rounded-2xl shadow-lg p-4 w-full flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-xs mx-auto mb-4">
                      <Image
                        src={imageUrl}
                        alt={`Recommendation ${index}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain rounded-md"
                      />
                    </div>
                    <Button asChild variant="default" className="px-4 py-2 bg-black text-white text-sm font-medium uppercase border border-black hover:bg-white hover:text-black transition">
                      <Link href={productUrl}>Buy now</Link>
                    </Button>
                  </div>
                </div>
              );
            } catch (error) {
              console.error(`Error parsing image JSON at index ${index}:`, error);
              return null;
            }
          })}
        </div>
      </main>
    </div>
  );
};

export default ForYouPage;
