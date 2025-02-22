"use client";

import { Button } from "@/components/components/buttonS";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Session } from "@supabase/auth-helpers-nextjs";
import { Home } from "lucide-react";

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white text-black">
      <nav className="w-full flex justify-center border-b border-black h-16 bg-white mb-10">
        <div className="w-full max-w-5xl flex justify-between items-center p-4 md:px-8">
          <Link href="/" className="p-2">
            <Home size={24} className="text-black" />
          </Link>
          {session ? (
            <Button
              variant="default"
              size="lg"
              className="bg-black text-white border border-black hover:bg-white hover:text-black transition rounded-none"
              onClick={handleSignOut}
            >
              Log Out
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button asChild variant="outline" size="lg" className="border border-black text-black hover:bg-black hover:text-white transition rounded-none">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="default" size="lg" className="bg-black text-white border border-black hover:bg-white hover:text-black transition rounded-none">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}