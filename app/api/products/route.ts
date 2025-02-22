import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";

const execPromise = promisify(exec);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const url =
    "https://api-sandbox.inditex.com/searchpmpa-sandbox/products?query=";
  const token = process.env.PUBLIC_INDITEX_TOKEN;

  try {
    // Execute curl request
    const { stdout } = await execPromise(
      `curl -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" "${url}"`
    );

    // Parse and return JSON response
    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}
