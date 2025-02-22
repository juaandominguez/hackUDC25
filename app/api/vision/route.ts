import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";


const execPromise = promisify(exec);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)
  const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
  const imageURL = searchParams.get("imageUrl");

  if(!imageURL) {
    return NextResponse.json(
      { message: "bad request" },
      { status: 400 }
    );
    
  }
  const url =
    `${process.env.PUBLIC_INDITEX_URL}/pubvsearch/products?image=${imageURL}`;
  const token = process.env.PUBLIC_INDITEX_TOKEN;

  try {
    // Execute curl request
    const { stdout } = await execPromise(
      `curl -A Mozilla -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" "${url}"`
    );

    console.log(stdout)
    // Parse and return JSON response
    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}
