"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface BookingStats {
  totalBooking: number;
  pendingBooking: number;
  confirmedBooking: number;
  totalTransaksi: number;
}

export default function CustomerDashboard() {
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [profile, setProfile] = useState({ name: "Valued Customer", email: "No email registered" })

  useEffect(() => {
    // 1. Ambil nama langsung dari localStorage browser
    const storedName = localStorage.getItem("user_name")
    const storedEmail = localStorage.getItem("user_email")
    
    if (storedName || storedEmail) {
      setProfile({
        name: storedName || "Valued Customer",
        email: storedEmail || "No email registered"
      })
    }

    // 2. Ambil token dari cookie untuk tarik data booking stats
    async function fetchStats() {
      try {
        const match = document.cookie.match(/(^| )token_kuliner=([^;]*)/)
        const token = match ? match[2] : null

        if (!token) return

        const dashboardUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/dashboard/customer`
        const response = await fetch(dashboardUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })

        if (response.ok) {
          const responseData = await response.json()
          setStats(responseData.data || null)
        }
      } catch (error) {
        console.error("Gagal fetch data booking:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-[#E6DEC4] font-sans text-[#5C321A]">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#5C321A]/10 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-serif font-bold tracking-wide">The Neighbourhood</h1>
          <p className="text-xs text-[#5C321A]/60">Customer Portal</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="text-xs text-[#5C321A]/60 font-mono">{profile.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#96683E] text-white flex items-center justify-center font-bold text-sm">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* KONTEN */}
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* BANNER */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#5C321A]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1">
              Welcome Back, {profile.name}! ✨
            </h2>
            <p className="text-sm text-[#5C321A]/70 font-light">
              Ready to experience another delightful culinary journey with us today?
            </p>
          </div>
          <Link href="/customer/booking" className="bg-[#96683E] text-white font-medium px-5 py-3 rounded-xl text-sm whitespace-nowrap">
            + Book a Table
          </Link>
        </div>

        {/* STATS DARI ENDPOINT BACKEND */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#5C321A]/10 shadow-sm">
            <p className="text-xs font-semibold text-[#5C321A]/60 uppercase tracking-wider mb-1">Total Reservations</p>
            <p className="text-3xl font-bold font-serif text-[#96683E]">{stats?.totalBooking ?? 0}</p> 
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#5C321A]/10 shadow-sm">
            <p className="text-xs font-semibold text-[#5C321A]/60 uppercase tracking-wider mb-1">Pending Confirmation</p>
            <p className="text-3xl font-bold font-serif text-amber-600">{stats?.pendingBooking ?? 0}</p> 
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#5C321A]/10 shadow-sm">
            <p className="text-xs font-semibold text-[#5C321A]/60 uppercase tracking-wider mb-1">Confirmed Tables</p>
            <p className="text-3xl font-bold font-serif text-emerald-600">{stats?.confirmedBooking ?? 0}</p>
          </div>
        </div>

        {/* TABEL */}
        <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#5C321A]/10">
            <h3 className="font-serif font-bold text-lg">Your Culinary Reservations</h3>
          </div>
          <div className="p-12 text-center space-y-3">
            <p className="font-medium text-sm">No active reservations found</p>
          </div>
        </div>
      </main>
    </div>
  )
}