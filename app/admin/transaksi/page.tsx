"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";
import { RefreshCw, Eye, X } from "lucide-react";

interface Transaksi {
  id: number;
  bookingId?: number;
  total?: number;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  booking?: {
    id: number;
    user?: { name: string };
    table?: { number: number };
  };
}

export default function AdminTransaksiPage() {
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransaksis = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/transaksi`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        cache: "no-store",
      });

      const json = await res.json();
      console.log("[transaksi response]", json);

      const data: Transaksi[] = Array.isArray(json?.data) ? json.data : [];
      setTransaksis(data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransaksis();
  }, [fetchTransaksis]);

  const getName = (t: Transaksi) => t.booking?.user?.name || "Guest";
  const getTotal = (t: Transaksi) => t.total || 0;
  const getMethod = (t: Transaksi) => t.paymentMethod || "";
  const getBookingId = (t: Transaksi) => t.bookingId || t.booking?.id || null;

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "paid" || s === "success" || s === "verified")
      return <span className="text-xs text-green-700 font-semibold bg-green-100 px-2.5 py-1 rounded-full">✓ Paid</span>;
    if (s === "cancelled" || s === "canceled" || s === "failed")
      return <span className="text-xs text-red-600 font-semibold bg-red-50 px-2.5 py-1 rounded-full">✕ Cancelled</span>;
    return <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Pending</span>;
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#5C321A]/10 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Transaksi</h1>
          <p className="text-[#96683E] text-sm mt-1">Riwayat pembayaran customer</p>
        </div>
        <button
          onClick={fetchTransaksis}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#96683E] hover:bg-[#5C321A] text-white rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Booking</th>
              <th className="py-4 px-5">Total</th>
              <th className="py-4 px-5">Metode</th>
              <th className="py-4 px-5">Tanggal</th>
              <th className="py-4 px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5C321A]/10 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#96683E] mx-auto" />
                  <p className="mt-3">Memuat transaksi...</p>
                </td>
              </tr>
            ) : transaksis.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <p className="text-4xl mb-3">🧾</p>
                  <p className="font-medium">Belum ada transaksi</p>
                </td>
              </tr>
            ) : (
              transaksis.map((t) => (
                <tr key={t.id} className="hover:bg-[#E6DEC4]/5 transition">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-[#5C321A]">{getName(t)}</p>
                    <p className="text-xs text-gray-400">Trx #{t.id}</p>
                  </td>
                  <td className="py-4 px-5">
                    {getBookingId(t) ? (
                      <span className="px-2 py-1 bg-[#E6DEC4]/30 rounded-lg text-xs font-medium">
                        #{getBookingId(t)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-medium text-[#5C321A]">{formatCurrency(getTotal(t))}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs text-gray-500 capitalize">{getMethod(t) || "-"}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs text-gray-500">{formatDate(t.createdAt)}</span>
                  </td>
                  <td className="py-4 px-5">
                    {getStatusBadge(t.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}