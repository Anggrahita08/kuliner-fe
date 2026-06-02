"use client"

import Link from "next/link"
import { useState, startTransition } from "react"
import { useRouter } from "next/navigation" 
import { storeCookies } from "@/helper/cookies" 
import { toast, ToastContainer } from "react-toastify" 
import "react-toastify/dist/ReactToastify.css" 

export default function SignIn(){
      const router = useRouter() 
      
      const [email, setEmail] = useState<string>("")
      const [password, setPassword] = useState<string>("")

      async function handleSignIn(e: React.FormEvent){
        e.preventDefault()
        
        try {
            const request = JSON.stringify({
                email,
                password
            })
            
            const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: request
            })

            const responseData = await response.json().catch(() => ({}));
            const message = responseData.message || "Terjadi kesalahan saat masuk.";

            if (!response.ok || responseData.success === false) {
                toast.error(
                    message,
                    { containerId: `toastLogin` }
                )
                return;
            }

            const tokenAsli = responseData.token || responseData.access_token || responseData.data?.token;

            if (tokenAsli) {
                toast.success(
                    "Login berhasil! Selamat datang kembali.",
                    { containerId: `toastLogin` }
                )
                
                // ====================================================
                // AMBIL EMAILNYA LANGSUNG & SIMPAN KE LOCALSTORAGE
                // ====================================================
                const namaDariEmail = email.split('@')[0];
                const namaFix = namaDariEmail.charAt(0).toUpperCase() + namaDariEmail.slice(1);
                
                localStorage.setItem("user_name", namaFix);
                localStorage.setItem("user_email", email);
                // ====================================================

                startTransition(async function () {
                    await storeCookies("token_kuliner", tokenAsli)
                    
                    if (responseData.role === "ADMIN" || responseData.data?.role === "ADMIN") {
                        setTimeout(() => router.push("/admin/profile"), 1000)
                    } else {
                        setTimeout(() => router.push("/customer/dashboard"), 1000)
                    }
                })
            } else {
                toast.warning(
                    "Gagal masuk: Token tidak ditemukan dalam respon server.",
                    { containerId: `toastLogin` }
                )
            }

        } catch(error){
            console.error("Error during sign in:", error)
            toast.error(
                "Terjadi masalah koneksi jaringan ke server.",
                { containerId: `toastLogin` }
            )
        }
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#E6DEC4] px-4 font-sans text-[#5C321A]">
          <ToastContainer containerId="toastLogin" position="top-center" autoClose={2500} hideProgressBar={false} />

          <div className="text-center mb-8">
            <h1 className="text-[32px] font-serif font-bold text-[#5C321A] mb-1 tracking-wide">
              The Neighbourhood
            </h1>
            <p className="text-sm text-[#5C321A]/70 font-light">
              Welcome back! Please sign in to access your account
            </p>
          </div>

          <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-10 border border-[#5C321A]/10">
            <h2 className="text-2xl font-serif font-bold text-center text-[#5C321A] mb-8">
              Customer Sign In
            </h2>
            
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#5C321A]/80 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C321A]/40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-[#5C321A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/40 focus:border-[#96683E] text-sm text-[#5C321A] placeholder-[#5C321A]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5C321A]/80 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C321A]/40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3 border border-[#5C321A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/40 focus:border-[#96683E] text-sm text-[#5C321A] placeholder-[#5C321A]/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#96683E] hover:bg-[#855b35] text-white font-medium py-3 rounded-xl transition duration-200 text-sm mt-3 shadow-sm"
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-[#5C321A]/60">
              Don't have an account yet?{" "}
              <Link className="text-[#96683E] hover:underline font-semibold" href={`/signup`}>
                Register here
              </Link>
            </div>
          </div>
        </div>
      )
}