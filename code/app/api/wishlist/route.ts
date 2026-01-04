import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import cheerio from "cheerio"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wishlistItems: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.wishlistItems)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, title } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Scrape initial price
    const price = await scrapePrice(url)
    if (price === null) {
      return NextResponse.json(
        { error: "Unable to detect a price from that URL." },
        { status: 422 }
      )
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        url,
        title: title || url,
        originalPrice: price,
        currentPrice: price,
        lastChecked: new Date(),
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

async function scrapePrice(url: string): Promise<number | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    })
    const html = response.data as string
    const $ = cheerio.load(html)

    const metaSelectors = [
      'meta[property="product:price:amount"]',
      'meta[property="og:price:amount"]',
      'meta[name="price"]',
      'meta[itemprop="price"]',
      'meta[name="twitter:data1"]',
    ]

    for (const selector of metaSelectors) {
      const content = $(selector).attr("content")
      const parsed = parsePrice(content)
      if (parsed !== null) return parsed
    }

    const priceSelectors = [
      '[itemprop="price"]',
      '[data-testid*="price"]',
      '[data-test*="price"]',
      ".price",
      ".product-price",
      ".product__price",
    ]

    for (const selector of priceSelectors) {
      const text = $(selector).first().text()
      const parsed = parsePrice(text)
      if (parsed !== null) return parsed
    }

    const ldJsonScripts = $('script[type="application/ld+json"]')
      .map((_, el) => $(el).text())
      .get()

    for (const scriptText of ldJsonScripts) {
      const parsed = extractPriceFromLdJson(scriptText)
      if (parsed !== null) return parsed
    }

    const bodyText = $("body").text()
    return findFirstPrice(bodyText)
  } catch (error) {
    console.error("Price scrape failed:", error)
    return null
  }
}

function parsePrice(value?: string | null): number | null {
  if (!value) return null
  const sanitized = value.replace(/[^\d.,]/g, "").trim()
  if (!sanitized) return null

  const lastDot = sanitized.lastIndexOf(".")
  const lastComma = sanitized.lastIndexOf(",")
  let normalized = sanitized

  if (lastDot !== -1 && lastComma !== -1) {
    if (lastComma > lastDot) {
      normalized = sanitized.replace(/\./g, "").replace(",", ".")
    } else {
      normalized = sanitized.replace(/,/g, "")
    }
  } else if (lastComma !== -1) {
    const decimals = sanitized.length - lastComma - 1
    normalized =
      decimals <= 2 ? sanitized.replace(",", ".") : sanitized.replace(/,/g, "")
  }

  const number = Number.parseFloat(normalized)
  return Number.isFinite(number) ? number : null
}

function extractPriceFromLdJson(scriptText: string): number | null {
  try {
    const data = JSON.parse(scriptText)
    return findPriceInJson(data)
  } catch {
    return null
  }
}

function findPriceInJson(value: unknown): number | null {
  if (!value) return null
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = findPriceInJson(entry)
      if (found !== null) return found
    }
    return null
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    const directKeys = ["price", "lowPrice", "highPrice"]
    for (const key of directKeys) {
      const parsed = parsePrice(String(record[key] ?? ""))
      if (parsed !== null) return parsed
    }
    if (record.offers) {
      const offerPrice = findPriceInJson(record.offers)
      if (offerPrice !== null) return offerPrice
    }
    if (record.priceSpecification) {
      const specPrice = findPriceInJson(record.priceSpecification)
      if (specPrice !== null) return specPrice
    }
    for (const nested of Object.values(record)) {
      const nestedPrice = findPriceInJson(nested)
      if (nestedPrice !== null) return nestedPrice
    }
  }
  return null
}

function findFirstPrice(text: string): number | null {
  const match = text.match(/[$€£]\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)
  return match ? parsePrice(match[0]) : null
}
