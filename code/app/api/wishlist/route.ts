import { NextRequest, NextResponse } from "next/server"
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

// Simple price scraping function (placeholder)
async function scrapePrice(url: string): Promise<number | null> {
  // This is a placeholder. In reality, you'd need to handle different sites.
  // For demo, return a random price or null
  return Math.floor(Math.random() * 100) + 10
}