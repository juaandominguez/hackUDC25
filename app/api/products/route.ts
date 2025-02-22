import type { NextApiRequest, NextApiResponse } from "next";
import { makeAuthenticatedRequest } from "@/utils/tokenManager";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const url = `${process.env.PUBLIC_INDITEX_URL}/searchpmpa/products`;
  
  try {
    const data = await makeAuthenticatedRequest(url,"GET","query=*");
    console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
