"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";
import { RefreshCw, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import VerifyBooking from "./verify";

interface Booking {
  id: number;
  customer_name?: string;
  customerName?: string;
  customer_email?: string;
  customerEmail?: string;
  booking_date?: string;
  date?: string;
  time?: string;
  guest_count?: number;
  guestCount?: number;
  table_number?: string;
  tableId?: number;
  status: string;
  payment_status?: string;
  paymentStatus?: string;
  payment_method?: string;
  paymentMethod?: string;
  notes?: string;
  payment_proof_url?: string;
  paymentProofUrl?: string;
  dp_amount?: number;
  dpAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  user?: { name: string; email: string };
  table?: { id: number; number: number };
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter & Pagination state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const endpoints = [
        `${baseUrl}/booking/laporan`,
        `${baseUrl}/booking`,
      ];

      let bookingsData: Booking[] = [];
      let found = false;

      for (const endpoint of endpoints) {
        if (found) break;
        try {
          const res = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            },
            cache: "no-store",
          });

          const data = await res.json();
          console.log(`[booking fetch] ${endpoint}`, data);

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
          found = true;
          console.log(`✅ Endpoint OK: ${endpoint} (${extracted.length} items)`);
        } catch (e) {
          console.warn("Endpoint error:", endpoint, e);
        }
      }

      setBookings(bookingsData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getCustomerName = (b: Booking) =>
    b.customer_name || b.customerName || b.user?.name || "Guest";
  const getCustomerEmail = (b: Booking) =>
    b.customer_email || b.customerEmail || b.user?.email || "";
  const getBookingDate = (b: Booking) => b.booking_date || b.date || "";
  const getGuestCount = (b: Booking) => b.guest_count || b.guestCount || 0;
  const getPaymentStatus = (b: Booking) =>
    b.payment_status || b.paymentStatus || "";
  const getPaymentMethod = (b: Booking) =>
    b.payment_method || b.paymentMethod || "";
  const getPaymentProofUrl = (b: Booking) =>
    b.payment_proof_url || b.paymentProofUrl || "";
  const getDpAmount = (b: Booking) => b.dp_amount || b.dpAmount || 0;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentBadge = (status: string | undefined) => {
    const s = status?.toLowerCase() || "";
    if (["success", "verified", "paid"].includes(s))
      return <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">✓ Paid</span>;
    if (["pending_verification", "uploaded"].includes(s))
      return <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full">⏳ Need Verification</span>;
    if (s === "pending" || s === "")
      return <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Pending</span>;
    return <span className="text-xs text-gray-500">{status}</span>;
  };

  const getFilteredBookings = () => {
    if (statusFilter === "all") return bookings;
    if (statusFilter === "pending") {
      return bookings.filter(
        (b) => !["confirmed", "cancelled", "canceled"].includes(b.status?.toLowerCase())
      );
    }
    return bookings.filter((b) => b.status?.toLowerCase() === statusFilter.toLowerCase());
  };

  const filteredBookings = getFilteredBookings();

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const toVerifyBookingFormat = (b: Booking) => ({
    id: b.id,
    status: b.status,
    date: getBookingDate(b),
    time: b.time,
    guestCount: getGuestCount(b),
    guest_count: b.guest_count,
    tableId: b.tableId,
    notes: b.notes,
    user: b.user ?? { name: getCustomerName(b), email: getCustomerEmail(b) },
    table: b.table,
  });

  const pendingCount = bookings.filter(
    (b) => !["confirmed", "cancelled", "canceled"].includes(b.status?.toLowerCase())
  ).length;
  const confirmedCount = bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length;
  const cancelledCount = bookings.filter((b) =>
    ["cancelled", "canceled"].includes(b.status?.toLowerCase())
  ).length;

  return (
    <div className="p-6 md:p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      <div className="flex justify-between items-center border-b border-[#5C321A]/10 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Booking Management</h1>
          <p className="text-[#96683E] text-sm mt-1">Manage and confirm customer reservations</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#96683E] hover:bg-[#5C321A] text-white rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", value: pendingCount, color: "text-yellow-600", filter: "pending" },
          { label: "Confirmed", value: confirmedCount, color: "text-green-600", filter: "confirmed" },
          { label: "Cancelled", value: cancelledCount, color: "text-red-500", filter: "cancelled" },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => {
              setStatusFilter(c.filter);
              setCurrentPage(1);
            }}
            className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              (c.filter === statusFilter) ||
              (c.filter === "pending" && statusFilter === "all" && c.label === "Pending")
                ? "border-[#96683E] ring-1 ring-[#96683E]/30"
                : "border-[#5C321A]/10"
            }`}
          >
            <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </button>
        ))}
      </div>

      {/* Filter indicator */}
      {statusFilter !== "all" && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#96683E]">Filter:</span>
            <span className="text-xs bg-[#E6DEC4]/50 px-2 py-1 rounded-full">
              {statusFilter === "pending"
                ? "Pending"
                : statusFilter === "confirmed"
                ? "Confirmed"
                : statusFilter === "cancelled"
                ? "Cancelled"
                : "Need Verification"}
            </span>
            <button
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="text-xs text-[#96683E] underline hover:text-[#5C321A]"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-[#96683E]">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Date & Time</th>
              <th className="py-4 px-5">Guests</th>
              <th className="py-4 px-5">Payment</th>
              <th className="py-4 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5C321A]/10 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#96683E] mx-auto" />
                  <p className="mt-3">Loading bookings...</p>
                </td>
              </tr>
            ) : paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="font-medium">No bookings found</p>
                  <p className="text-xs mt-1">
                    {statusFilter !== "all"
                      ? `No ${statusFilter} bookings available`
                      : "Bookings will appear here once customers make reservations"}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#E6DEC4]/5 transition">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-[#5C321A]">{getCustomerName(booking)}</p>
                    {getCustomerEmail(booking) && (
                      <p className="text-xs text-[#96683E]">{getCustomerEmail(booking)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">#{booking.id}</p>
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-medium">{formatDate(getBookingDate(booking))}</p>
                    <p className="text-xs text-[#96683E]">{booking.time || "-"}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-medium">{getGuestCount(booking)}</span>
                    <span className="text-xs text-gray-500 ml-1">pax</span>
                  </td>
                  <td className="py-4 px-5">
                    {booking.status?.toLowerCase() === "confirmed" ? (
                      <span className="text-xs text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full">
                        ✓ Confirmed
                      </span>
                    ) : ["cancelled", "canceled"].includes(booking.status?.toLowerCase()) ? (
                      <span className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                        ✕ Cancelled
                      </span>
                    ) : (
                      <div className="space-y-1.5">
                        {getPaymentBadge(getPaymentStatus(booking))}
                        {getDpAmount(booking) > 0 && (
                          <p className="text-xs text-[#96683E]">{formatCurrency(getDpAmount(booking))}</p>
                        )}
                        {getPaymentMethod(booking) && (
                          <p className="text-xs text-gray-400 capitalize">{getPaymentMethod(booking)}</p>
                        )}
                        {getPaymentProofUrl(booking) && (
                          <button
                            onClick={() => {
                              setPreviewUrl(getPaymentProofUrl(booking));
                              setSelectedBooking(booking);
                            }}
                            className="flex items-center gap-1 text-xs text-[#96683E] hover:text-[#5C321A] underline transition"
                          >
                            <Eye size={12} /> View Proof
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center">
                      <VerifyBooking
                        booking={toVerifyBookingFormat(booking)}
                        onSuccess={fetchBookings}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#5C321A]/10">
            <p className="text-xs text-[#96683E]">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#5C321A]/20 text-[#96683E] hover:bg-[#E6DEC4]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-[#96683E] text-white"
                          : "text-[#96683E] hover:bg-[#E6DEC4]/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#5C321A]/20 text-[#96683E] hover:bg-[#E6DEC4]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Proof Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setPreviewUrl(null);
            setSelectedBooking(null);
          }}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-[#4A3525]">Payment Proof</h3>
                {selectedBooking && (
                  <p className="text-xs text-[#96683E]">
                    {getCustomerName(selectedBooking)} — #{selectedBooking.id}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewUrl}
                alt="Payment proof"
                className="w-full max-h-96 object-contain rounded-xl bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.png";
                }}
              />
            </div>
            {selectedBooking && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  DP:{" "}
                  <span className="font-bold text-[#96683E]">
                    {formatCurrency(getDpAmount(selectedBooking))}
                  </span>
                </p>
                <VerifyBooking
                  booking={toVerifyBookingFormat(selectedBooking)}
                  onSuccess={() => {
                    fetchBookings();
                    setPreviewUrl(null);
                    setSelectedBooking(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}