import type { NextApiRequest, NextApiResponse } from "next";
import { makeAuthenticatedRequest } from "@/utils/tokenManager";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
  const imageURL = searchParams.get("imageUrl");

  if (!imageURL) {
    return NextResponse.json(
      { message: "bad request" },
      { status: 400 }
    );
  }

  try {
    const url = `${process.env.PUBLIC_INDITEX_URL}/pubvsearch/products`;
    const data = await makeAuthenticatedRequest(url, 'GET', `image=${imageURL}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
