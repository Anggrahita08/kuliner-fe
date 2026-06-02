"use client"

import Link from "next/link"
import { useState, startTransition } from "react"
import { useRouter } from "next/navigation" 
import { storeCookies } from "@/helper/cookies" 
import { toast, ToastContainer } from "react-toastify" 


export default function Signup(){
      const router = useRouter() 
      
      const [email, setEmail] = useState<string>("")
      const [password, setPassword] = useState<string>("")
      const [name, setName] = useState<string>("")
      const [phone, setPhone] = useState<string>("")

 async function handleSignUp(e: React.FormEvent){
        e.preventDefault()
        
        try {
            //alur register
            const request = JSON.stringify({
                name,
                email,
                password,
                phone
            })
            
            const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })

            const responseData = await response.json().catch(() => ({}));
            const message = responseData.message || "";

            // Cek apakah response gagal atau  email duplikat
            if (
                !response.ok || 
                responseData.success === false || 
                message.toLowerCase().includes("exist") || 
                message.toLowerCase().includes("daftar") ||
                message.toLowerCase().includes("already")
            ) {
                 //identifikasi email sama
                 if (response.status === 400 || response.status === 409 || message.toLowerCase().includes("exist") || message.toLowerCase().includes("daftar")) {
                     toast.error(
                         "This email is already registered! Please use another email address.",
                         { containerId: `toastSignup` }
                     )
                 } else {
                     toast.error(
                         message || "Failed to register.",
                         { containerId: `toastSignup` }
                     )
                 }
                 return; // STOP DI SINI, jangan lanjut login otomatis!
            }

            // ====================================================
            // ALUR 2: OTOMATIS LOGIN (HANYA JIKA REGISTER LOLOS)
            // ====================================================
            const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
            
            const loginResponse = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }) 
            })

            const loginData = await loginResponse.json().catch(() => ({}));

            if (!loginResponse.ok || loginData.success === false) {
                toast.warning(
                    "Registration was successful, but automatic login failed. Please log in manually.",
                    { containerId: `toastSignup` }
                )
                setTimeout(() => router.push("/signin"), 1500)
                return;
            }

            
            // token diambil dismpen ke cookies
            const tokenAsli = loginData.access_token || loginData.data?.token || loginData.data?.access_token || loginData.token;

            if (tokenAsli) {
                toast.success(
                    `Welcome to The Neighbourhood, ${name}! ✨`,
                    { containerId: `toastSignup` }
                )
                //
                startTransition(async function () {
                    await storeCookies("token_kuliner", tokenAsli)
                    setTimeout(() => router.push("/customer/dashboard"), 1500)
                })
            } else {
                toast.warning(
                    "Registration successful, please login manually to enter.",
                    { containerId: `toastSignup` }
                )
                setTimeout(() => router.push("/signin"), 1500)
            }

        } catch(error){
            console.error("Error during sign up & auto login:", error)
            toast.error(
                "An error occurred while connecting to the server.",
                { containerId: `toastSignup` }
            )
        }
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#E6DEC4] px-4 font-sans text-[#5C321A]">
          
          <ToastContainer containerId="toastSignup" position="top-center" autoClose={3000} hideProgressBar={false} />

          
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-serif font-bold text-[#5C321A] mb-1 tracking-wide">
              The Neighbourhood
            </h1>
            <p className="text-sm text-[#5C321A]/70 font-light">
              Welcome! Please fill in the details to create your account
            </p>
          </div>

          {/* Kartu Form */}
          <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-10 border border-[#5C321A]/10">
            <h2 className="text-2xl font-serif font-bold text-center text-[#5C321A] mb-8">
              Customer Register
            </h2>
            
            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Input Nama */}
              <div>
                <label className="block text-sm font-semibold text-[#5C321A]/80 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C321A]/40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 border border-[#5C321A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/40 focus:border-[#96683E] text-sm text-[#5C321A] placeholder-[#5C321A]/30 transition-all"
                  />
                </div>
              </div>

              {/* Input Email */}
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

              {/* Input Nomor Telepon */}
              <div>
                <label className="block text-sm font-semibold text-[#5C321A]/80 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C321A]/40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.018a14.995 14.995 0 0 1-6.571-6.571l2.017-1.514c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-11 pr-4 py-3 border border-[#5C321A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/40 focus:border-[#96683E] text-sm text-[#5C321A] placeholder-[#5C321A]/30 transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
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

              {/* Tombol Register */}
              <button
                type="submit"
                className="w-full bg-[#96683E] hover:bg-[#855b35] text-white font-medium py-3 rounded-xl transition duration-200 text-sm mt-3 shadow-sm"
              >
                Register
              </button>
            </form>

            {/* Link Bawah */}
            <div className="text-center mt-6 text-sm text-[#5C321A]/60">
              Already have an account?{" "}
              <Link className="text-[#96683E] hover:underline font-semibold"
                    href={`/signin`}>
                Login here
              </Link>
            </div>
          </div>
        </div>
      )
}