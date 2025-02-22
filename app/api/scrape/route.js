import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET(req) {
  let browser;
  try {
    // Obtener la URL de la query
    const { searchParams } = new URL(req.url);
    const pageUrl = searchParams.get("url");

    if (!pageUrl) {
      return NextResponse.json(
        { error: "Falta la URL en la consulta" },
        { status: 400 }
      );
    }

    // Lanzar Puppeteer con configuración optimizada para Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Configurar User-Agent para reducir detección
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Reducir detección de bot
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    // Navegar a la página con espera para cargar contenido dinámico
    await page.goto(pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Esperar a que haya imágenes
    await page.waitForSelector("img", { timeout: 15000 });

    // Obtener la primera imagen visible
    const imageUrl = await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        if (img.complete && img.naturalWidth > 0) {
          return img.src;
        }
      }
      return null;
    });

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No se encontró ninguna imagen" },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error al scrapear la imagen:", error);
    return NextResponse.json(
      { error: "Error al scrapear la imagen" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
