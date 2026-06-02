"use client"

import { useState, startTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storeCookies } from "@/helper/cookies" 
import { toast, ToastContainer } from "react-toastify" 
import "react-toastify/dist/ReactToastify.css" 

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}));
      const message = data.message || "An error occurred while logging in."

      if (!response.ok || data.success === false) {
        toast.error(message, { containerId: `toastAdmin` })
        setIsLoading(false)
        return;
      }

      const tokenAsli = data.token || data.access_token || data.data?.token

      if (tokenAsli) {
        toast.success("Login Admin berhasil! Membuka panel internal...", { containerId: `toastAdmin` })
        
        startTransition(async function () {
          await storeCookies("token_kuliner", tokenAsli)
          
          setTimeout(() => router.push("/admin/dashboard"), 1000)
        })
      } else {
        toast.warning("Login failed: Admin token not found.", { containerId: `toastAdmin` })
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("An error occurred while connecting to the server.", { containerId: `toastAdmin` })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E6DEC4] font-sans text-[#5C321A] flex flex-col items-center justify-center px-6">
      {/* Wadah Toast khusus Admin */}
      <ToastContainer containerId="toastAdmin" position="top-center" autoClose={2500} hideProgressBar={false} />
      
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-2xl p-8 shadow-md border border-[#5C321A]/10">
        
        {/* Header Form */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-full border border-[#5C321A]/20 items-center justify-center text-[#96683E] mb-3 bg-[#E6DEC4]/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-[#5C321A]">Portal Internal Staff</h1>
          <p className="text-xs text-[#5C321A]/70 mt-1">Please log in to access the restaurant management panel.</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/70">Email Admin</label>
            <input 
              type="email" 
              placeholder="nama@theneighbourhood.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#E6DEC4]/20 border border-[#5C321A]/20 rounded-lg p-2.5 text-sm text-[#5C321A] focus:outline-none focus:border-[#96683E] font-medium"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/70">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E6DEC4]/20 border border-[#5C321A]/20 rounded-lg p-2.5 text-sm text-[#5C321A] focus:outline-none focus:border-[#96683E]"
              disabled={isLoading}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#96683E] hover:bg-[#5C321A] text-white text-sm font-semibold py-3 rounded-lg transition shadow-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Log In"}
          </button>
        </form>

        {/* Link Register Admin */}
        <div className="text-center mt-5 text-xs text-[#5C321A]/70">
          Don't have an admin account?{" "}
          <Link href="/adminportal/signup" className="text-[#96683E] hover:underline font-semibold">
            Register here
          </Link>
        </div>

        {/* Tombol Kembali */}
        <div className="text-center mt-4 pt-4 border-t border-[#5C321A]/5">
          <Link href="/landingpage" className="text-xs text-[#96683E] hover:underline">
            &larr; Back to Main Homepage
          </Link>
        </div>

      </div>
    </div>
  )
}