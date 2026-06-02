"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Calendar, Clock, Users, MapPin, CreditCard } from "lucide-react";
import { getCookies } from "@/helper/cookies";

interface Booking {
  id: number;
  status: string;
  date?: string;
  time?: string;
  guestCount?: number;
  guest_count?: number;
  tableId?: number;
  notes?: string;
  user?: { name: string; email: string };
  table?: { id: number; number: number };
}

interface VerifyBookingProps {
  booking: Booking;
  onSuccess?: () => void; // callback untuk refresh list setelah aksi
}

const VerifyBooking = ({ booking, onSuccess }: VerifyBookingProps) => {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customerName = booking.user?.name || "Guest";
  const guestCount = booking.guestCount || booking.guest_count || 0;
  const tableNumber = booking.table?.number ? `Table #${booking.table.number}` : booking.tableId ? `Table #${booking.tableId}` : "-";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleAction = async (action: "CONFIRMED" | "CANCELLED") => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/booking/${booking.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify({ status: action }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || `Gagal ${action === "CONFIRMED" ? "konfirmasi" : "batalkan"} booking`);
      }

      toast.success(
        action === "CONFIRMED"
          ? `Booking ${customerName} berhasil dikonfirmasi!`
          : `Booking ${customerName} berhasil dibatalkan.`
      );

      setOpenConfirm(false);
      setOpenCancel(false);

      // Refresh data
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => router.refresh(), 500);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  // Kalau sudah confirmed atau cancelled, tampilkan badge saja
  if (booking.status?.toUpperCase() === "CONFIRMED") {
    return (
      <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
        <CheckCircle2 size={14} /> Confirmed
      </span>
    );
  }

  if (booking.status?.toUpperCase() === "CANCELLED") {
    return (
      <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
        <XCircle size={14} /> Cancelled
      </span>
    );
  }

  return (
    <>
      {/* Tombol aksi */}
      <div className="flex gap-2">
        <button
          onClick={() => setOpenConfirm(true)}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
        >
          Confirm
        </button>
        <button
          onClick={() => setOpenCancel(true)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
        >
          Cancel
        </button>
      </div>

      {/* Modal Konfirmasi */}
      {openConfirm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => !isLoading && setOpenConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-50 px-6 py-5 border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A3525] text-lg">Konfirmasi Booking</h3>
                  <p className="text-xs text-green-600">Yakin ingin mengkonfirmasi reservasi ini?</p>
                </div>
              </div>
            </div>

            {/* Detail Booking */}
            <div className="px-6 py-4 space-y-3">
              <div className="bg-[#FDFBF7] rounded-xl p-4 border border-[#96683E]/10 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Users size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-semibold ml-auto">{customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Calendar size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Tanggal:</span>
                  <span className="font-semibold ml-auto text-right">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Clock size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Waktu:</span>
                  <span className="font-semibold ml-auto">{booking.time || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Users size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Tamu:</span>
                  <span className="font-semibold ml-auto">{guestCount} orang</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <MapPin size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Meja:</span>
                  <span className="font-semibold ml-auto">{tableNumber}</span>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-2 text-[#4A3525]">
                    <CreditCard size={14} className="text-[#96683E] mt-0.5" />
                    <span className="text-gray-500">Catatan:</span>
                    <span className="font-semibold ml-auto text-right max-w-[160px]">{booking.notes}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center">
                Tindakan ini tidak bisa dibatalkan setelah dikonfirmasi.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleAction("CONFIRMED")}
                disabled={isLoading}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Batalkan */}
      {openCancel && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => !isLoading && setOpenCancel(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-red-50 px-6 py-5 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="text-red-500" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A3525] text-lg">Batalkan Booking</h3>
                  <p className="text-xs text-red-500">Yakin ingin membatalkan reservasi ini?</p>
                </div>
              </div>
            </div>

            {/* Detail Booking */}
            <div className="px-6 py-4 space-y-3">
              <div className="bg-[#FDFBF7] rounded-xl p-4 border border-[#96683E]/10 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Users size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-semibold ml-auto">{customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Calendar size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Tanggal:</span>
                  <span className="font-semibold ml-auto text-right">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Clock size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Waktu:</span>
                  <span className="font-semibold ml-auto">{booking.time || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <Users size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Tamu:</span>
                  <span className="font-semibold ml-auto">{guestCount} orang</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3525]">
                  <MapPin size={14} className="text-[#96683E]" />
                  <span className="text-gray-500">Meja:</span>
                  <span className="font-semibold ml-auto">{tableNumber}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Customer akan mendapat notifikasi bahwa booking dibatalkan.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenCancel(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleAction("CANCELLED")}
                disabled={isLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyBooking;