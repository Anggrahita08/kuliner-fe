"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Mengecek keberadaan cookie token_kuliner
    const token = document.cookie.split('; ').find(row => row.startsWith('token_kuliner='))
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#EFE9D3] font-sans text-[#4A3525] flex flex-col selection:bg-[#9C6D44] selection:text-white">

      {/* 1. NAVBAR */}
      <nav className="bg-[#EFE9D3] sticky top-0 z-50 transition-all border-b border-[#4A3525]/10 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-serif font-bold text-[#4A3525] tracking-wide hover:opacity-90 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#9C6D44]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M3.284 14.253A8.998 8.998 0 0 1 12 3c4.195 0 7.81 2.872 8.716 6.753M3.284 14.253a8.981 8.981 0 0 0 0 2.524m17.432-2.524a8.981 8.981 0 0 1 0 2.524m0 0A8.998 8.998 0 0 1 12 21M3.284 16.777a8.998 8.998 0 0 0 17.432 0" />
            </svg>
            <span>The Neighbourhood</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#4A3525]">
            <Link href="/" className="hover:text-[#9C6D44] transition-colors">Home</Link>
            <Link href="/customer/menu" className="hover:text-[#9C6D44] transition-colors">Menu</Link> 
            {isLoggedIn ? (
              <Link href="/customer/dashboard" className="hover:text-[#9C6D44] transition-colors">Dashboard</Link>
            ) : (
              <Link href="/signin" className="hover:text-[#9C6D44] transition-colors">Sign In</Link>
            )}
          </div>

          <Link href="/customer/booking" className="bg-[#9C6D44] hover:bg-[#8B5E3A] text-white text-sm font-medium px-6 py-2.5 rounded-full transition shadow-md">
            Book a Table
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="bg-gradient-to-br from-[#4A3525] to-[#6B4C3A] text-[#EFE9D3] py-28 md:py-36 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold max-w-4xl leading-[1.15] mb-6 tracking-wide">
            Experience Refined<br />Dining in South Jakarta
          </h1>
          <p className="text-base md:text-lg text-center opacity-90 max-w-2xl font-light mb-10 leading-relaxed mx-auto">
            A cozy neighborhood bistro where exceptional cuisine meets warm hospitality. Every dish tells a story of passion and craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer/booking" className="bg-[#9C6D44] hover:bg-[#8B5E3A] text-white font-medium px-8 py-3 rounded-full transition shadow-md text-sm">Book a Table</Link>
            <Link href="/customer/menu" className="border border-[#EFE9D3] text-[#EFE9D3] hover:bg-[#EFE9D3] hover:text-[#4A3525] font-medium px-8 py-3 rounded-full transition text-sm">View Menu</Link>
          </div>
        </div>
      </header>

      {/* 3. OUR STORY SECTION */}
      <section className="bg-[#EFE9D3] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-[#4A3525] leading-tight">A Neighborhood Gem</h2>
            <p className="text-[#4A3525]/80 font-light leading-relaxed">
              The Neighbourhood was born from a simple dream: to create a place where friends and families could gather over exceptional food in an atmosphere that feels like home, yet exceeds expectations.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center"><div className="text-3xl font-bold text-[#9C6D44]">15+</div><div className="text-xs text-[#4A3525]/60">Years Experience</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-[#9C6D44]">50+</div><div className="text-xs text-[#4A3525]/60">Menu Items</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-[#9C6D44]">10k+</div><div className="text-xs text-[#4A3525]/60">Happy Guests</div></div>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" alt="Restaurant" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
        </div>
      </section>

      {/* 4. SPECIALITIES */}
      <section className="bg-[#FDFBF7] py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-[#4A3525] mb-12">OUR SPECIALITIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" alt="Dish" className="h-40 w-full object-cover rounded-lg mb-4"/>
              <h3 className="text-xl font-bold mb-2">Truffle Mushroom Crostini</h3>
              <p className="text-sm text-[#4A3525]/60 mb-4">Wild mushrooms, truffle oil, parmesan</p>
              <span className="text-xl font-bold text-[#9C6D44]">$12.50</span>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" alt="Dish" className="h-40 w-full object-cover rounded-lg mb-4"/>
              <h3 className="text-xl font-bold mb-2">Tuna Tartare</h3>
              <p className="text-sm text-[#4A3525]/60 mb-4">Fresh yellowfin tuna, avocado</p>
              <span className="text-xl font-bold text-[#9C6D44]">$18.00</span>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <img src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800" alt="Dish" className="h-40 w-full object-cover rounded-lg mb-4"/>
              <h3 className="text-xl font-bold mb-2">Wagyu Beef Ribeye</h3>
              <p className="text-sm text-[#4A3525]/60 mb-4">12oz Australian wagyu, herb butter</p>
              <span className="text-xl font-bold text-[#9C6D44]">$78.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5, 6, 7. INFO, CTA & FOOTER */}
      <section className="bg-[#EFE9D3] py-20 px-6 text-center">
        <h3 className="text-xl font-bold">Open Daily | Prime Location</h3>
      </section>
      <section className="bg-[#9C6D44] py-20 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
        <Link href="/customer/booking" className="bg-white text-[#9C6D44] px-8 py-3 rounded-full font-semibold">Reserve Table</Link>
      </section>
      <footer className="bg-[#4A3525] text-[#EFE9D3] p-10 text-center text-sm">
        <p>© 2026 The Neighbourhood. All rights reserved.</p>
      </footer>

    </div>
  )
}