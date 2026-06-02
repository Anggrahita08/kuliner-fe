'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ApiDashboardStats {
  totalPendapatan?: number;
  persentaseKenaikan?: string;
  totalBookingMeja?: number;
  mejaAktifHariIni?: number;
  menuPalingLaris?: string;
  porsiTerjual?: number;
  ratingKepuasan?: number;
  totalUlasan?: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ApiDashboardStats | null>(null);
  const [roleTitle, setRoleTitle] = useState("Admin");

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookie("token_kuliner");

    if (!token) {
      
      const timer = setTimeout(() => {
        toast.error("Session not found or expired.", { 
          containerId: "dashToast",
          toastId: "session-expired-error" // Mencegah spam duplikat saat di-refresh
        });
      }, 400);
      setIsLoading(false);
      return () => clearTimeout(timer);
    }

    async function fetchDashboardData() {
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        let dashboardEndpoint = "/dashboard/admin";

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const currentRole = profileData.data?.role || profileData.role;

          if (currentRole === "customer") {
            setRoleTitle("Customer");
            dashboardEndpoint = "/auth/dashboard/customer";
          } else {
            setRoleTitle("Admin");
          }
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${dashboardEndpoint}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const resJson = await response.json().catch(() => ({}));

        if (response.ok) {
          setStats(resJson.data || resJson);
        }
      } catch (err) {
        console.error("Backend data sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#EFE9D3] p-6 md:p-10 font-serif text-[#4A3525]">
      {/* Wadah Toast ditaruh paling atas agar tidak terpotong layout kontainer */}
      <div className="relative z-50">
        <ToastContainer containerId="dashToast" position="top-right" autoClose={3000} />
      </div>
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#9C6D44]/30">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A3525]">{roleTitle} Dashboard</h1>
          <p className="text-sm text-[#4A3525]/80 font-sans mt-1">
            Welcome back! Monitor the performance and business of The Neighbourhood restaurant today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-xs font-semibold tracking-wider text-[#4A3525] bg-[#FDFBF7] px-4 py-2 rounded-md shadow-sm border border-[#9C6D44]/20 font-sans uppercase">
          Period: May 2026
        </div>
      </div>

      {/* STATS CARD - TAILWIND MURNI (Gaya Awal Banget dengan Warna Earth Tone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 font-sans">
        
        {/* CARD 1: PENDAPATAN */}
        <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#9C6D44]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4A3525]/60">Total Revenue</p>
          <p className="text-2xl font-black text-[#9C6D44] mt-1">
            {isLoading ? "Rp ..." : `Rp ${(stats?.totalPendapatan ?? 23000000).toLocaleString("id-ID")}`}
          </p>
          <span className="text-[11px] font-bold text-[#9C6D44] bg-[#9C6D44]/10 px-2 py-0.5 rounded mt-2 inline-block">
            {stats?.persentaseKenaikan || "+12% from April"}
          </span>
        </div>

        {/* CARD 2: RESERVASI */}
        <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#9C6D44]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4A3525]/60">Total Table Bookings</p>
          <p className="text-2xl font-black text-[#4A3525] mt-1">
            {isLoading ? "..." : `${stats?.totalBookingMeja ?? 142} Reservations`}
          </p>
          <span className="text-[11px] font-bold text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded mt-2 inline-block">
            {isLoading ? "..." : `${stats?.mejaAktifHariIni ?? 8} Active Tables Today`}
          </span>
        </div>

        {/* CARD 3: MENU TERLARIS */}
        <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#9C6D44]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4A3525]/60">Best Selling Menu</p>
          <p className="text-xl font-black text-[#4A3525] mt-1 truncate">
            {isLoading ? "..." : (stats?.menuPalingLaris || "Special Fried Rice")}
          </p>
          <span className="text-[11px] font-bold text-[#9C6D44] bg-[#9C6D44]/10 px-2 py-0.5 rounded mt-2 inline-block">
            {isLoading ? "..." : `${stats?.porsiTerjual ?? 340} Portions Sold`}
          </span>
        </div>

        {/* CARD 4: RATING */}
        <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#9C6D44]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4A3525]/60">Satisfaction Rating</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {isLoading ? "..." : `${stats?.ratingKepuasan ?? 4.8} / 5.0`}
          </p>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mt-2 inline-block">
            From {stats?.totalUlasan || "1.2k"} Reviews
          </span>
        </div>

      </div>

      {/* --- REPOSISI LAYOUT BAWAH (GRAFIK & DATA PEGAWAI) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* KIRI: Tren Pendapatan (Sudah Dibenahi Total Batang & Labelnya) */}
        <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#9C6D44]/20 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-[#4A3525]">Revenue Trend</h4>
            <p className="text-xs text-[#4A3525]/70 font-sans">Total restaurant revenue for the last 5 months</p>
          </div>

          {/* Container Grid Grafik */}
          <div className="flex items-end w-full h-56 pt-6 font-sans text-[11px] text-stone-400">
            {/* Kolom Angka Sumbu Y */}
            <div className="flex flex-col justify-between h-full pr-3 text-right w-14 font-medium shrink-0 pb-6">
              <div>Rp24M</div>
              <div>Rp18M</div>
              <div>Rp12M</div>
              <div>Rp6M</div>
              <div>Rp0M</div>
            </div>
            
            {/* Garis Batas Sumbu Grafik dan Batang */}
            <div className="flex-1 flex items-end justify-between h-full border-l border-b border-stone-200 px-4 pb-1">
              {[
                { bulan: "Jan", tinggi: "25%" },
                { bulan: "Feb", tinggi: "45%" },
                { bulan: "Mar", tinggi: "60%" },
                { bulan: "Apr", tinggi: "75%" },
                { bulan: "May", tinggi: "92%" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                  {/* Batang Grafik Cokelat (Menggunakan inline style agar height persentase terbaca sempurna) */}
                  <div 
                    style={{ height: item.tinggi }} 
                    className="w-8 bg-[#9C6D44]/30 group-hover:bg-[#9C6D44] rounded-t transition-all duration-300 cursor-pointer" 
                  />
                  {/* Nama Bulan di Sumbu X */}
                  <span className="absolute -bottom-6 text-stone-600 font-semibold">{item.bulan}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-2"></div>
        </div>

        {/* KANAN: Pegawai Terbaik Bulan Ini */}
        <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#9C6D44]/20 shadow-sm lg:col-span-5 space-y-4">
          <div>
            <h4 className="text-lg font-bold text-[#4A3525]">Best Employees of the Month</h4>
            <p className="text-xs text-[#4A3525]/70 font-sans">Based on review ratings & completed orders</p>
          </div>

          <div className="space-y-4 pt-2 font-sans text-xs font-semibold text-[#4A3525]">
            {[
              { nama: "Ahmad", lebar: "w-full" },
              { nama: "Siti", lebar: "w-[90%]" },
              { nama: "Budi", lebar: "w-[82%]" },
              { nama: "Dewi", lebar: "w-[75%]" },
              { nama: "Rian", lebar: "w-[60%]" }
            ].map((staff, index) => (
              <div key={index} className="flex items-center">
                <span className="w-16 shrink-0">{staff.nama}</span>
                <div className="flex-1 bg-stone-100/80 h-6 rounded-md overflow-hidden ml-2 relative flex items-center">
                  <div className={`bg-black h-full ${staff.lebar} rounded-md transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}