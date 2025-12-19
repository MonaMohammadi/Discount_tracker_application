import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Discount Tracker</h1>
        <p className="text-gray-600 mb-8">
          Track prices on your wishlist items and get notified when prices drop by 10% or more.
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
