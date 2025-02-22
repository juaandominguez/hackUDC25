"use client";

import Navbar from "@/components/components/navbar";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const Favorites = () => {
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
          .select("liked_urls")
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

  // Extract liked URLs from data
  const likedUrls = data?.flatMap((item) => item.liked_urls) || [];

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex flex-col items-center gap-6 p-6 sm:p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight text-center">
          Your Favorites
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-500">
          Make this place your definition of ART
        </p>

        {/* Masonry Grid Layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {likedUrls.map((url, index) => (
            <div key={index} className="relative group overflow-hidden rounded-xl shadow-md">
              <img
                src={url}
                alt={`Favorite ${index}`}
                className="w-full object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
