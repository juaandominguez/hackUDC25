"use client";

import { Button } from "@/components/components/buttonS";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Session } from "@supabase/auth-helpers-nextjs";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    // Suscribirse a cambios en la sesión
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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Button asChild variant={"ghost"} size={"lg"}>
              <Link href={"/"}>Home</Link>
            </Button>
          </div>
          {session ? (
            <Button
              variant={"default"}
              size={"lg"}
              onClick={handleSignOut}
            >
              Log Out
            </Button>
          ) : (
            <div className="flex gap-5 items-center">
              <Button asChild variant={"outline"} size={"lg"}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant={"default"} size={"lg"}>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
      <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>
    </div>
  );
}
