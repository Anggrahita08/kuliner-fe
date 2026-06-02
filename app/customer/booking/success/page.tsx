"use client";

import { CheckCircle2, AlertCircle, ArrowLeft, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F8F5EE] flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#96683E]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#4A3525]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative bg-white rounded-2xl border border-[#96683E]/10 shadow-xl max-w-md w-full overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#96683E] to-[#5C321A]" />
        
        <div className="p-8">
          {/* Success icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#4A3525] text-center mb-2">
            Booking Berhasil!
          </h1>
          <p className="text-[#96683E] text-center mb-6">
            Reservasi kamu telah berhasil dibuat
          </p>

          {/* Status card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <CalendarCheck size={16} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Status Booking</p>
                <p className="text-amber-800 font-bold text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                  Menunggu Konfirmasi
                </p>
                <p className="text-sm text-amber-700/80 mt-2">
                  Admin akan mengonfirmasi booking kamu dalam waktu dekat.
                </p>
              </div>
            </div>
          </div>

          {/* Informasi tambahan */}
          <div className="bg-[#FDFBF7] rounded-xl p-4 mb-6 border border-[#96683E]/10">
            <div className="flex items-center gap-2 text-xs text-[#96683E] mb-2">
              <AlertCircle size={12} />
              <span>Informasi Penting</span>
            </div>
            <ul className="text-xs text-[#4A3525]/70 space-y-1.5 ml-5 list-disc">
              <li>Silakan cek status reservasi secara berkala</li>
              <li>Konfirmasi akan dikirim melalui notifikasi</li>
              <li>Hubungi restoran jika ada perubahan jadwal</li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <Link href="/customer/reservationstatus" className="block">
              <button className="w-full bg-[#4A3525] text-white py-3 rounded-xl font-bold hover:bg-[#2e2117] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Lihat Reservasi Saya
              </button>
            </Link>
            <Link href="/customer/dashboard" className="block">
              <button className="w-full bg-white text-[#96683E] border-2 border-[#96683E]/30 py-3 rounded-xl font-bold hover:bg-[#FDFBF7] hover:border-[#96683E] transition-all duration-200 flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                Kembali ke Dashboard
              </button>
            </Link>
          </div>

          {/* Booking ID hint */}
          <p className="text-center text-[10px] text-[#96683E]/40 mt-6">
            Simpan bukti booking untuk referensi
          </p>
        </div>
      </div>
    </div>
  );
}