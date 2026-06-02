"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, Users, MapPin, ArrowLeft } from "lucide-react";

export default function BookingSuccessPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#96683E]/20">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A3525]">Booking Berhasil!</h1>
            <p className="text-[#96683E] mt-2">Reservasi kamu telah berhasil dibuat</p>
          </div>

          <div className="p-6">
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#4A3525]">STATUS BOOKING</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  Menunggu Konfirmasi
                </span>
              </div>
              <p className="text-sm text-[#96683E]">
                Admin akan mengkonfirmasi booking kamu dalam waktu dekat.
              </p>
            </div>

            {bookingData && (
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-[#4A3525] mb-3">Detail Reservasi</h3>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-[#96683E]" />
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium text-[#4A3525]">{bookingData.date}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-[#96683E]" />
                  <span className="text-gray-600">Waktu:</span>
                  <span className="font-medium text-[#4A3525]">{bookingData.time}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-[#96683E]" />
                  <span className="text-gray-600">Jumlah Tamu:</span>
                  <span className="font-medium text-[#4A3525]">{bookingData.guests} orang</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-[#96683E]" />
                  <span className="text-gray-600">Meja:</span>
                  <span className="font-medium text-[#4A3525]">#1</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h4 className="font-bold text-[#4A3525] text-sm mb-2">Informasi Penting</h4>
              <ul className="text-xs text-[#96683E] space-y-1 list-disc list-inside">
                <li>Silakan cek status reservasi secara berkala</li>
                <li>Konfirmasi akan dikirim melalui notifikasi</li>
                <li>Hubungi restoran jika ada perubahan jadwal</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/customer/reservationstatus")}
                className="w-full py-3 bg-[#96683E] text-white rounded-xl font-bold hover:bg-[#5C321A] transition"
              >
                Lihat Reservasi Saya
              </button>
              
              <button
                onClick={() => router.push("/customer/dashboard")}
                className="w-full py-3 border border-[#96683E] text-[#96683E] rounded-xl font-bold hover:bg-[#EFE9D3] transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Dashboard
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Simpan bukti booking untuk referensi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}