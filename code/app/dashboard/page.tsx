"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface WishlistItem {
  id: string
  title: string
  url: string
  originalPrice: number | null
  currentPrice: number | null
  lastChecked: string | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchItems()
    }
  }, [status])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, title: newTitle }),
      })

      if (response.ok) {
        setNewUrl("")
        setNewTitle("")
        await fetchItems()
      } else {
        alert("Failed to add item")
      }
    } catch (error) {
      alert("Error adding item")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Discount Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Item to Wishlist</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/product"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title (Optional)
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="My Favorite Product"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Wishlist"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 p-6 border-b">Your Wishlist</h2>
          {items.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No items in your wishlist yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Original Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Current Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Discount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Last Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => {
                    const discount =
                      item.originalPrice && item.currentPrice
                        ? (((item.originalPrice - item.currentPrice) / item.originalPrice) * 100).toFixed(2)
                        : null
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{item.title || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${item.originalPrice?.toFixed(2) || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${item.currentPrice?.toFixed(2) || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {discount ? (
                            <span className={parseFloat(discount) > 10 ? "text-green-600" : "text-gray-600"}>
                              {discount}%
                            </span>
                          ) : (
                            "Pending"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.lastChecked ? new Date(item.lastChecked).toLocaleDateString() : "Never"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
