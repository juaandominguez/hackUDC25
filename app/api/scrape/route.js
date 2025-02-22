import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req) {
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

    // Iniciar Puppeteer con opciones avanzadas
    const browser = await puppeteer.launch({
      headless: "new", // Asegura compatibilidad con últimas versiones
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled", // Oculta Puppeteer
        "--disable-web-security",
      ],
    });

    const page = await browser.newPage();

    // Configurar User-Agent y opciones para evitar detección
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Reducir detección de bot
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    // Navegar a la página con mayor tiempo de espera
    await page.goto(pageUrl, {
      waitUntil: "domcontentloaded", // Mejor para sitios dinámicos
      timeout: 60000,
    });

    // Esperar a que aparezcan imágenes cargadas con JavaScript
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

    await browser.close();

    if (!imageUrl) {
      console.error("No se encontró ninguna imagen");
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
  }
}
