"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
} from "lucide-react";

interface Booking {
  id: number;
  status: string;
  date?: string;
  booking_date?: string;
  time?: string;
  guest_count?: number;
  guestCount?: number;
  notes?: string;
  payment_status?: string;
  paymentStatus?: string;
  payment_method?: string;
  paymentMethod?: string;
  dp_amount?: number;
  dpAmount?: number;
  createdAt?: string;
  table?: { id: number; number: number };
  table_number?: string;
  tableId?: number;
  user?: { name: string; email: string };
}

const STATUS_CONFIG = {
  pending: {
    label: "Menunggu Konfirmasi",
    sublabel: "Booking kamu sedang diproses oleh restoran.",
    icon: Clock,
    step: 1,
    barClass: "bg-amber-50 border-amber-100",
    iconClass: "text-amber-500",
    labelClass: "text-amber-700",
    subClass: "text-amber-600",
  },
  confirmed: {
    label: "Booking Dikonfirmasi",
    sublabel: "Reservasi kamu sudah dikonfirmasi. Sampai jumpa!",
    icon: CheckCircle2,
    step: 2,
    barClass: "bg-green-50 border-green-100",
    iconClass: "text-green-600",
    labelClass: "text-green-700",
    subClass: "text-green-600",
  },
  cancelled: {
    label: "Booking Dibatalkan",
    sublabel: "Maaf, reservasi ini telah dibatalkan.",
    icon: XCircle,
    step: -1,
    barClass: "bg-red-50 border-red-100",
    iconClass: "text-red-500",
    labelClass: "text-red-700",
    subClass: "text-red-500",
  },
  canceled: {
    label: "Booking Dibatalkan",
    sublabel: "Maaf, reservasi ini telah dibatalkan.",
    icon: XCircle,
    step: -1,
    barClass: "bg-red-50 border-red-100",
    iconClass: "text-red-500",
    labelClass: "text-red-700",
    subClass: "text-red-500",
  },
};

// Hanya 2 step: Dipesan -> Dikonfirmasi
const STEPS = ["Dipesan", "Dikonfirmasi"];

const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  paid:      { label: "Lunas", cls: "bg-green-100 text-green-700" },
  success:   { label: "Lunas", cls: "bg-green-100 text-green-700" },
  verified:  { label: "Terverifikasi", cls: "bg-green-100 text-green-700" },
  pending_verification: { label: "Menunggu Verifikasi", cls: "bg-amber-100 text-amber-700" },
  uploaded:  { label: "Bukti Diunggah", cls: "bg-amber-100 text-amber-700" },
  pending:   { label: "Belum Bayar", cls: "bg-red-100 text-red-600" },
  "":        { label: "Belum Bayar", cls: "bg-red-100 text-red-600" },
};

export default function ReservationStatus() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const endpoints = [
        `${baseUrl}/booking/my`,
        `${baseUrl}/booking/user`,
        `${baseUrl}/booking/history`,
        `${baseUrl}/booking`,
      ];

      let bookingsData: Booking[] = [];
      let success = false;

      for (const endpoint of endpoints) {
        if (success) break;
        try {
          const res = await fetch(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            },
            cache: "no-store",
          });

          const data = await res.json();
          console.log(`[reservationstatus] ${endpoint}`, res.status, data);

          if (!res.ok) continue;

          let extracted: Booking[] = [];
          if (Array.isArray(data)) {
            extracted = data;
          } else if (Array.isArray(data?.data?.list)) {
            extracted = data.data.list;
          } else if (Array.isArray(data?.data)) {
            extracted = data.data;
          } else if (Array.isArray(data?.bookings)) {
            extracted = data.bookings;
          } else if (Array.isArray(data?.list)) {
            extracted = data.list;
          }

          bookingsData = extracted;
          success = true;
          console.log(`✅ Reservation endpoint OK: ${endpoint}`);
        } catch (e) {
          console.warn("Endpoint error:", endpoint, e);
        }
      }

      if (!success) throw new Error("Tidak ada endpoint yang berhasil");
      setBookings(bookingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const getDate = (b: Booking) => b.booking_date || b.date || "";
  const getGuestCount = (b: Booking) => b.guest_count || b.guestCount || 0;
  const getPaymentStatus = (b: Booking) =>
    (b.payment_status || b.paymentStatus || "").toLowerCase();
  const getDpAmount = (b: Booking) => b.dp_amount || b.dpAmount || 0;
  const getPaymentMethod = (b: Booking) => b.payment_method || b.paymentMethod || "";
  const getTableInfo = (b: Booking) => {
    if (b.table?.number) return `Meja #${b.table.number}`;
    if (b.table_number) return b.table_number;
    if (b.tableId) return `Meja #${b.tableId}`;
    return "-";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatCreatedAt = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-[#96683E]">
        <div className="w-8 h-8 border-2 border-[#96683E]/20 border-t-[#96683E] rounded-full animate-spin" />
        <p className="text-sm">Memuat reservasi kamu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-center px-4">
        <XCircle className="text-red-400" size={36} />
        <p className="text-sm text-red-500 font-medium">{error}</p>
        <button
          onClick={fetchMyBookings}
          className="text-xs text-[#96683E] underline hover:text-[#5C321A] transition"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-[220px] flex flex-col items-center justify-center gap-3 text-center px-4">
        <Calendar className="text-[#96683E]/30" size={48} />
        <p className="font-semibold text-[#4A3525]">Belum ada reservasi</p>
        <p className="text-sm text-[#96683E]">
          Kamu belum memiliki booking. Buat reservasi sekarang!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-[#96683E]">{bookings.length} reservasi ditemukan</p>
        <button
          onClick={fetchMyBookings}
          className="flex items-center gap-1.5 text-xs text-[#96683E] hover:text-[#5C321A] transition"
        >
          <RefreshCw size={13} />
          Perbarui
        </button>
      </div>

      {bookings.map((booking) => {
        const statusKey = (booking.status?.toLowerCase() || "pending") as keyof typeof STATUS_CONFIG;
        const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG["pending"];
        const StatusIcon = config.icon;
        const isCancelled = statusKey === "cancelled" || statusKey === "canceled";
        const isExpanded = expandedId === booking.id;
        const payKey = getPaymentStatus(booking);
        const payBadge = PAYMENT_BADGE[payKey] ?? PAYMENT_BADGE[""];
        const currentStep = isCancelled ? -1 : config.step;

        return (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-[#5C321A]/10 overflow-hidden shadow-sm"
          >
            <div className={`px-5 py-3 flex items-center gap-3 border-b ${config.barClass}`}>
              <StatusIcon size={18} className={config.iconClass} />
              <div className="flex-1">
                <p className={`text-sm font-bold ${config.labelClass}`}>{config.label}</p>
                <p className={`text-xs ${config.subClass}`}>{config.sublabel}</p>
              </div>
              <span className="text-xs text-[#96683E]/60">#{booking.id}</span>
            </div>

            {/* Progress steps - hanya Dipesan dan Dikonfirmasi */}
            {!isCancelled && (
              <div className="px-5 py-4 border-b border-[#5C321A]/05">
                <div className="flex items-center">
                  {STEPS.map((label, idx) => {
                    // Untuk step 0 (Dipesan): active jika currentStep > 0 atau (currentStep === 1 && idx === 0)
                    // Untuk step 1 (Dikonfirmasi): active jika currentStep > 1
                    const isActive = currentStep > idx;
                    const isCurrent = currentStep - 1 === idx;
                    const isLast = idx === STEPS.length - 1;
                    
                    return (
                      <div key={label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                              ${isActive || isCurrent ? "bg-[#96683E] text-white" : "bg-[#E6DEC4]/40 text-[#96683E]/30"}
                              ${isCurrent ? "ring-2 ring-[#96683E]/20 ring-offset-1" : ""}`}
                          >
                            {isActive && !isCurrent ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`text-[10px] whitespace-nowrap font-medium ${
                              isActive || isCurrent ? "text-[#5C321A]" : "text-[#96683E]/40"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {!isLast && (
                          <div
                            className={`h-0.5 flex-1 mx-1 mb-4 rounded ${
                              isActive ? "bg-[#96683E]" : "bg-[#E6DEC4]/40"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { icon: Calendar, label: "Tanggal", value: formatDate(getDate(booking)) },
                { icon: Clock, label: "Waktu", value: booking.time || "-" },
                { icon: Users, label: "Tamu", value: `${getGuestCount(booking)} orang` },
                { icon: MapPin, label: "Meja", value: getTableInfo(booking) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon size={14} className="text-[#96683E] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#96683E] mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-[#4A3525] leading-tight">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setExpandedId(isExpanded ? null : booking.id)}
              className="w-full px-5 py-2.5 flex items-center justify-between text-xs text-[#96683E] hover:bg-[#FDFBF7] transition border-t border-[#5C321A]/05"
            >
              <span>{isExpanded ? "Sembunyikan detail" : "Lihat detail pembayaran"}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 pt-4 bg-[#FDFBF7] border-t border-[#5C321A]/05 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#96683E]">
                    <CreditCard size={13} />
                    Status Pembayaran
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payBadge.cls}`}>
                    {payBadge.label}
                  </span>
                </div>

                {getDpAmount(booking) > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#96683E]">Nominal DP</span>
                    <span className="font-semibold text-[#5C321A]">{formatCurrency(getDpAmount(booking))}</span>
                  </div>
                )}

                {getPaymentMethod(booking) && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#96683E]">Metode Pembayaran</span>
                    <span className="font-semibold text-[#5C321A] capitalize">{getPaymentMethod(booking)}</span>
                  </div>
                )}

                {booking.notes && (
                  <div className="flex items-start gap-2 text-xs text-[#96683E] pt-1">
                    <FileText size={13} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium mb-0.5">Catatan</p>
                      <p className="text-[#5C321A]">{booking.notes}</p>
                    </div>
                  </div>
                )}

                {booking.createdAt && (
                  <p className="text-[10px] text-[#96683E]/50 pt-1 border-t border-[#5C321A]/05">
                    Dipesan pada {formatCreatedAt(booking.createdAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}