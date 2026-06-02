"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storeCookies } from "@/helper/cookies"
import { toast, ToastContainer } from "react-toastify" 
import "react-toastify/dist/ReactToastify.css" 

export default function AdminSignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 1. Registrasi dengan role: "ADMIN" otomatis
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role: "ADMIN" 
        }),
      })

      const data = await response.json().catch(() => ({}));
      const message = data.message || "Registration failed."

      if (!response.ok || data.success === false) {
        toast.error(message, { containerId: "toastAdminReg" })
        setIsLoading(false)
        return
      }

      // 2. Coba ambil token langsung dari response register
      const tokenAsli = data.token || data.data?.token;

      if (tokenAsli) {
        toast.success("Account created successfully!", { containerId: "toastAdminReg" })
        await storeCookies("token_kuliner", tokenAsli)
        setTimeout(() => router.push("/admin/dashboard"), 1500)
      } else {
        // 3. Jika tidak dapat token, tembak login otomatis
        toast.info("Registering, please wait...", { containerId: "toastAdminReg" })
        
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        
        const loginData = await loginRes.json().catch(() => ({}));
        const tokenDariLogin = loginData.token || loginData.data?.token;

        if (tokenDariLogin) {
          await storeCookies("token_kuliner", tokenDariLogin)
          toast.success("Welcome back!", { containerId: "toastAdminReg" })
          setTimeout(() => router.push("/admin/dashboard"), 1500)
        } else {
          toast.error("Session failed. Please try logging in manually.", { containerId: "toastAdminReg" })
          setIsLoading(false)
        }
      }

    } catch (err) {
      console.error("Sign up error:", err)
      toast.error("Server connection error.", { containerId: "toastAdminReg" })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E6DEC4] font-sans text-[#5C321A] flex flex-col items-center justify-center px-6">
      <ToastContainer containerId="toastAdminReg" position="top-center" autoClose={2500} />
      
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-2xl p-8 shadow-md border border-[#5C321A]/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-[#5C321A]">Register Staff Account</h1>
          <p className="text-xs text-[#5C321A]/70 mt-1">Create an administrator credential.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#5C321A]/70">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#E6DEC4]/20 border border-[#5C321A]/20 rounded-lg p-2.5 text-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#5C321A]/70">Email Admin</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#E6DEC4]/20 border border-[#5C321A]/20 rounded-lg p-2.5 text-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#5C321A]/70">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E6DEC4]/20 border border-[#5C321A]/20 rounded-lg p-2.5 text-sm"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#96683E] hover:bg-[#5C321A] text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-5 text-xs text-[#5C321A]/70">
          Already have an account?{" "}
          <Link href="/adminportal/signin" className="text-[#96683E] hover:underline font-semibold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}