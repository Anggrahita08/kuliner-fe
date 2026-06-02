"use client";

import { useState, useEffect } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";
import { Calendar, Users, MapPin, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Booking {
  id: number;
  userId: number;
  tableId: number;
  date: string;
  time: string;
  guestCount: number;
  status: string;
  payment_status?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  table?: {
    id: number;
    number: number;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  canceled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function LaporanReservasiPage() {
  const [laporan, setLaporan] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    needVerification: 0,
  });

  const fetchLaporan = async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${baseUrl}/booking`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        cache: 'no-store',
      });

      const res = await response.json();
      console.log("API Response:", res);
      
      if (res.success && Array.isArray(res.data)) {
        setLaporan(res.data);
        
        // Hitung statistik
        const pendingCount = res.data.filter((b: Booking) => b.status?.toLowerCase() === "pending").length;
        const confirmedCount = res.data.filter((b: Booking) => b.status?.toLowerCase() === "confirmed").length;
        const cancelledCount = res.data.filter((b: Booking) => b.status?.toLowerCase() === "cancelled" || b.status?.toLowerCase() === "canceled").length;
        
        setStats({
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount,
          needVerification: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reservation report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getCustomerName = (booking: Booking) => {
    return booking.user?.name || `User #${booking.userId}` || "-";
  };

  const getCustomerEmail = (booking: Booking) => {
    return booking.user?.email || "-";
  };

  const getTableNumber = (booking: Booking) => {
    return booking.table?.number ? `Table #${booking.table.number}` : `Table #${booking.tableId}` || "-";
  };

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  };

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 print:block">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3525]">Booking Management</h1>
          <p className="text-[#96683E] mt-1">Manage and confirm customer reservations</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-[#5C321A] text-white px-6 py-2.5 rounded-xl hover:bg-[#96683E] transition-all print:hidden shadow-sm"
        >
          Print Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 print:mb-4">
        {[
          { label: "PENDING", value: stats.pending, color: "bg-amber-50 border-amber-200", textColor: "text-amber-700" },
          { label: "CONFIRMED", value: stats.confirmed, color: "bg-green-50 border-green-200", textColor: "text-green-700" },
          { label: "CANCELLED", value: stats.cancelled, color: "bg-red-50 border-red-200", textColor: "text-red-700" },
          { label: "NEED VERIFICATION", value: stats.needVerification, color: "bg-blue-50 border-blue-200", textColor: "text-blue-700" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-4 text-center`}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#E6DEC4]/30 border-b border-[#5C321A]/10">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Customer</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Date & Time</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Guests</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Table</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Payment</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A]">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-[#5C321A] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5C321A]/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#96683E]/20 border-t-[#96683E] rounded-full animate-spin" />
                      <p className="text-sm text-[#96683E]">Loading reservations...</p>
                    </div>
                  </td>
                </tr>
              ) : laporan.length > 0 ? (
                laporan.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={booking.id} className="hover:bg-[#FDFBF7] transition">
                      <td className="p-4">
                        <p className="font-semibold text-[#4A3525]">{getCustomerName(booking)}</p>
                        <p className="text-xs text-[#96683E]/70">{getCustomerEmail(booking)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-[#96683E]" />
                          <span className="text-sm">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-[#96683E]" />
                          <span className="text-sm">{booking.time || "-"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-[#96683E]" />
                          <span>{booking.guestCount} pax</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#96683E]" />
                          <span>{getTableNumber(booking)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                          Pending
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full w-fit ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 print:hidden">
                          {booking.status?.toLowerCase() === "pending" && (
                            <>
                              <button className="text-green-600 hover:text-green-800 text-xs bg-green-50 px-3 py-1.5 rounded-lg font-medium transition">
                                ✓ Confirm
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-3 py-1.5 rounded-lg font-medium transition">
                                ✗ Cancel
                              </button>
                            </>
                          )}
                          {booking.status?.toLowerCase() === "confirmed" && (
                            <span className="text-xs text-green-600">-</span>
                          )}
                          {booking.status?.toLowerCase() === "cancelled" && (
                            <span className="text-xs text-red-600">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <p className="text-[#96683E]">No reservations found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}