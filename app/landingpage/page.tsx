"use client"

import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E6DEC4] font-sans text-[#5C321A] flex flex-col selection:bg-[#96683E] selection:text-white">
      
      {/* 1. NAVBAR */}
      <nav className="bg-[#E6DEC4] sticky top-0 z-50 transition-all border-b border-[#5C321A]/10 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo dengan Ikon Sendok Garpu Mewah */}
          <Link href="/landingpage" className="flex items-center space-x-2 text-xl font-serif font-bold text-[#5C321A] tracking-wide hover:opacity-90 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#96683E]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M3.284 14.253A8.998 8.998 0 0 1 12 3c4.195 0 7.81 2.872 8.716 6.753M3.284 14.253a8.981 8.981 0 0 0 0 2.524m17.432-2.524a8.981 8.981 0 0 1 0 2.524m0 0A8.998 8.998 0 0 1 12 21M3.284 16.777a8.998 8.998 0 0 0 17.432 0" />
            </svg>
            <span>The Neighbourhood</span>
          </Link>

          {/* Menu Navigasi Pelanggan */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#5C321A]">
            <Link href="/landingpage" className="hover:text-[#96683E] transition-colors">Home</Link>
            <Link href="/menu" className="hover:text-[#96683E] transition-colors">Menu</Link>
            <Link href="/booking" className="hover:text-[#96683E] transition-colors">My Reservations</Link>
          </div>

          {/* Tombol Auth Customer */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/signin" 
              className="bg-[#9A9578] hover:bg-[#888368] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-semibold text-[#5C321A] hover:text-[#96683E] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="bg-[#96683E] text-[#E6DEC4] py-24 md:py-32 px-6 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold max-w-4xl leading-[1.15] mb-6 tracking-wide">
          Experience Refined<br />Dining in South Jakarta
        </h1>
        <p className="text-base md:text-lg opacity-90 max-w-2xl font-light mb-8 leading-relaxed">
          Where culinary artistry meets warm hospitality. Every dish tells a story, every moment becomes a memory.
        </p>
        <Link 
          href="/signin" 
          className="bg-[#9A9578] hover:bg-[#888368] text-white font-medium px-6 py-3 rounded-lg transition flex items-center space-x-2 text-sm shadow-md"
        >
          <span>Book a Table</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </header>

      {/* 3. WHY DINE WITH US (FEATURES) */}
      <section className="bg-[#E6DEC4] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-[#5C321A] text-center mb-16">
            Why Dine With Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#FDFBF7] rounded-2xl p-8 text-center shadow-sm border border-[#5C321A]/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#5C321A]/20 flex items-center justify-center text-[#96683E] mb-6 bg-[#E6DEC4]/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.435.744-.435.916 0l1.914 4.86c.074.187.258.321.46.348l5.218.707c.479.065.67.653.33.98l-3.822 3.693a.48.48 0 0 0-.138.427l1.006 5.165c.092.473-.414.841-.836.593l-4.723-2.482a.48.48 0 0 0-.442 0l-4.723 2.482c-.422.248-.928-.12-.836-.593l1.006-5.165a.48.48 0 0 0-.138-.427L3.547 10.42c-.34-.327-.149-.915.33-.98l5.218-.707a.48.48 0 0 0 .46-.348l1.914-4.86Z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#5C321A] mb-3">Premium Quality</h3>
              <p className="text-sm text-[#5C321A]/80 font-light leading-relaxed">
                Only the finest ingredients sourced from local farms and trusted suppliers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FDFBF7] rounded-2xl p-8 text-center shadow-sm border border-[#5C321A]/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#5C321A]/20 flex items-center justify-center text-[#96683E] mb-6 bg-[#E6DEC4]/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#5C321A] mb-3">Intimate Ambiance</h3>
              <p className="text-sm text-[#5C321A]/80 font-light leading-relaxed">
                A warm, inviting atmosphere perfect for special occasions or everyday dining.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FDFBF7] rounded-2xl p-8 text-center shadow-sm border border-[#5C321A]/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#5C321A]/20 flex items-center justify-center text-[#96683E] mb-6 bg-[#E6DEC4]/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#5C321A] mb-3">Award-Winning Chef</h3>
              <p className="text-sm text-[#5C321A]/80 font-light leading-relaxed">
                Our culinary team brings years of expertise and passion to every plate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GASTRONOMIC JOURNEY */}
      <section className="bg-[#FDFBF7] py-24 px-6 border-t border-[#5C321A]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-[#5C321A] leading-tight">
              A Gastronomic Journey Awaits
            </h2>
            <p className="text-[#5C321A]/90 font-light leading-relaxed">
              Our menu is a celebration of flavors, combining traditional Indonesian ingredients with modern culinary techniques. Each dish is thoughtfully crafted to deliver an unforgettable dining experience.
            </p>
            <Link 
              href="/menu"
              className="inline-flex border border-[#5C321A] text-[#5C321A] font-semibold px-6 py-3 rounded-lg hover:bg-[#5C321A] hover:text-white transition items-center space-x-2 text-sm"
            >
              <span>View Our Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Kolase Galeri Gambar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" alt="Dish 1" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600" alt="Dish 2" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
            </div>
            <div className="space-y-4 pt-8">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600" alt="Dish 3" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600" alt="Dish 4" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER & BANNER BAWAH */}
      <footer className="bg-[#5C321A] text-[#E6DEC4] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* CTA Banner Bawah */}
          <div className="mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Ready to Experience Excellence?</h2>
            <p className="opacity-80 max-w-xl mx-auto font-light text-sm">
              Reserve your table today and let us create an unforgettable dining experience for you.
            </p>
            <Link 
              href="/signin"
              className="inline-block bg-[#E6DEC4] text-[#5C321A] font-semibold px-6 py-3 rounded-lg hover:bg-[#FDFBF7] transition text-sm shadow-md"
            >
              Book Your Table Now &gt;
            </Link>
          </div>

          {/* Grid Informasi Kontak */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-10 text-left border-t border-[#E6DEC4]/10 pt-12 text-sm font-light">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">The Neighbourhood</h3>
              <p className="opacity-70 leading-relaxed text-xs">
                Experience refined dining in the heart of South Jakarta. Where culinary excellence meets warm hospitality.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold">Contact Us</h4>
              <p className="opacity-80 text-xs">📍 Pasar Minggu, South Jakarta</p>
              <p className="opacity-80 text-xs">📞 +62 21 7890 1234</p>
              <p className="opacity-80 text-xs">✉️ hello@theneighbourhood.id</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold">Opening Hours</h4>
              <p className="opacity-80 text-xs">🕒 Lunch: 11:00 - 15:00</p>
              <p className="opacity-80 text-xs">🕒 Dinner: 17:00 - 22:00</p>
              <p className="opacity-80 text-xs">🚫 Closed on Mondays</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold">Follow Us</h4>
              <p className="opacity-80 text-xs hover:underline cursor-pointer">Instagram</p>
              <p className="opacity-80 text-xs hover:underline cursor-pointer">Facebook</p>
            </div>
          </div>

          {/* Hak Cipta + Pintu Masuk Rahasia Admin */}
          <div className="w-full text-center opacity-40 text-xs mt-16 border-t border-[#E6DEC4]/5 pt-6">
            <Link href="/adminportal/signin" className="hover:underline transition-all">
              &copy; 2026 The Neighbourhood. All rights reserved.
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}