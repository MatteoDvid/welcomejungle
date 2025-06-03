"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MatchRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /matches (the actual matches page)
    router.replace("/matches")
  }, [router])

  return (
    <div className="min-h-screen bg-jungle-yellow flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-jungle-gray border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-jungle-gray">Redirection...</p>
      </div>
    </div>
  )
} 