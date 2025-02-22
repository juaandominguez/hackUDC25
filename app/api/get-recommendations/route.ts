import { NextRequest, NextResponse } from "next/server";

import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

import { createClient } from "@/utils/supabase/server";
import { makeAuthenticatedRequest } from "@/utils/tokenManager";

export async function GET(req: any, res: any) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
  const imageURL = searchParams.get("imageUrl");

  if (!imageURL) {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const url = `${process.env.PUBLIC_INDITEX_URL}/pubvsearch/products`;
    const data = await makeAuthenticatedRequest(
      url,
      "GET",
      `image=${imageURL}`
    );

    console.log(data);

    const productLinks = data.map((product: { link: string }) => product.link);

    const photos = await Promise.all(
      productLinks.map(async (url: any) => {
        console.log(url);
        const scrapeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/scrape?url=${encodeURIComponent(url)}`
        );

        if (!scrapeResponse.ok) {
          throw new Error(`Failed to scrape ${url}`);
        }

        return await scrapeResponse.json();
      })
    );

    const may_like_data = (await supabase
      .from("products")
      .select("may_like")
      .eq("user_id", userId)) as any;

    const may_like_photos_data = await supabase
      .from("products")
      .select("may_like_photos")
      .eq("user_id", userId);

    if (may_like_data.data![0]) {
      await supabase
        .from("products")
        .update([
          {
            may_like: [...productLinks],
          },
        ])
        .eq("user_id", userId);

      await supabase
        .from("products")
        .update([
          {
            may_like_photos: [...photos],
          },
        ])
        .eq("user_id", userId);
    } else {
      await supabase
        .from("products")
        .update([
          {
            may_like: [...may_like_data.data![0].may_like, ...productLinks],
          },
        ])
        .eq("user_id", userId);

      await supabase
        .from("products")
        .update([
          {
            may_like_photos: [
              ...may_like_photos_data.data![0].may_like_photos,
              ...photos,
            ],
          },
        ])
        .eq("user_id", userId);
    }

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
