"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Clock, RefreshCw, Eye, X } from "lucide-react";

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
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Berdasarkan Swagger: coba /booking/laporan dulu (tidak difilter by user)
      // fallback ke /booking
      const adminEndpoints = [
        `${baseUrl}/booking/laporan`,   // endpoint laporan — kemungkinan return semua
        `${baseUrl}/booking`,           // fallback
      ];

      let res: any = null;
      let workingEndpoint = `${baseUrl}/booking`;

      for (const endpoint of adminEndpoints) {
        const tryRes = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
          cache: "no-store",
        });
        const tryData = await tryRes.json();
        console.log(`Trying: ${endpoint} → status: ${tryRes.status}`, tryData);

        const items = tryData?.data ?? tryData;
        if (tryRes.ok && Array.isArray(items) && items.length > 0) {
          res = tryData;
          workingEndpoint = endpoint;
          console.log("✅ Working endpoint:", endpoint);
          break;
        }
        if (!res) res = tryData;
      }

      console.log("Final endpoint used:", workingEndpoint);
      console.log("Full API Response:", JSON.stringify(res, null, 2));

      let bookingsData: Booking[] = [];

      // Handle berbagai kemungkinan struktur response
      if (res.success && Array.isArray(res.data)) {
        bookingsData = res.data;
      } else if (Array.isArray(res)) {
        bookingsData = res;
      } else if (res.data && Array.isArray(res.data)) {
        bookingsData = res.data;
      } else if (res.bookings && Array.isArray(res.bookings)) {
        bookingsData = res.bookings;
      } else {
        console.warn("Unexpected response format:", res);
        bookingsData = [];
      }

      console.log("Processed bookings:", bookingsData.length, "items");
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify({ status }),
      });

      const res = await response.json();
      console.log("Update status response:", response.status, res);

      if (!response.ok) {
        throw new Error(res.message || `Failed to ${status} booking`);
      }

      toast.success(`Booking ${status} successfully!`);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper: normalize field names (support snake_case & camelCase)
  const getCustomerName = (b: Booking) => b.customer_name || b.customerName || "Guest";
  const getCustomerEmail = (b: Booking) => b.customer_email || b.customerEmail || "";
  const getBookingDate = (b: Booking) => b.booking_date || b.date || "";
  const getGuestCount = (b: Booking) => b.guest_count || b.guestCount || 0;
  const getPaymentStatus = (b: Booking) => b.payment_status || b.paymentStatus || "";
  const getPaymentMethod = (b: Booking) => b.payment_method || b.paymentMethod || "";
  const getPaymentProofUrl = (b: Booking) => b.payment_proof_url || b.paymentProofUrl || "";
  const getDpAmount = (b: Booking) => b.dp_amount || b.dpAmount || 0;

  const getTableInfo = (b: Booking) => {
    if (b.table_number) return b.table_number;
    if (b.tableId) return `Table #${b.tableId}`;
    return "-";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
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

  const getStatusBadge = (status: string | undefined) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "confirmed") {
      return (
        <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
          <CheckCircle2 size={14} /> CONFIRMED
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
          <XCircle size={14} /> CANCELLED
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
        <Clock size={14} /> PENDING
      </span>
    );
  };

  const getPaymentBadge = (status: string | undefined) => {
    const s = status?.toLowerCase() || "";
    if (s === "success" || s === "verified" || s === "paid") {
      return <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">✓ Paid</span>;
    }
    if (s === "pending_verification" || s === "uploaded") {
      return (
        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full">
          ⏳ Need Verification
        </span>
      );
    }
    if (s === "pending" || s === "") {
      return <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Pending</span>;
    }
    return <span className="text-xs text-gray-500">{status}</span>;
  };

  // Summary counts
  const pendingCount = bookings.filter(
    (b) => b.status?.toLowerCase() !== "confirmed" && b.status?.toLowerCase() !== "cancelled" && b.status?.toLowerCase() !== "canceled"
  ).length;
  const confirmedCount = bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length;
  const cancelledCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "cancelled" || b.status?.toLowerCase() === "canceled"
  ).length;
  const needVerifCount = bookings.filter(
    (b) => getPaymentStatus(b) === "pending_verification" || getPaymentStatus(b) === "uploaded"
  ).length;

  return (
    <div className="p-6 md:p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      {/* Header */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-500">{cancelledCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Need Verification</p>
          <p className="text-2xl font-bold text-orange-600">{needVerifCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Date & Time</th>
              <th className="py-4 px-5">Guests</th>
              <th className="py-4 px-5">Table</th>
              <th className="py-4 px-5">Notes</th>
              <th className="py-4 px-5">Payment</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5C321A]/10 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#96683E] mx-auto"></div>
                  <p className="mt-3">Loading bookings...</p>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="font-medium">No bookings found</p>
                  <p className="text-xs mt-1">Bookings will appear here once customers make reservations</p>
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#E6DEC4]/5 transition">
                  {/* Customer */}
                  <td className="py-4 px-5">
                    <p className="font-semibold text-[#5C321A]">{getCustomerName(booking)}</p>
                    {getCustomerEmail(booking) && (
                      <p className="text-xs text-[#96683E]">{getCustomerEmail(booking)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">#{booking.id}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-5">
                    <p className="font-medium">{formatDate(getBookingDate(booking))}</p>
                    <p className="text-xs text-[#96683E]">{booking.time || "-"}</p>
                  </td>

                  {/* Guests */}
                  <td className="py-4 px-5">
                    <span className="font-medium">{getGuestCount(booking)}</span>
                    <span className="text-xs text-gray-500 ml-1">pax</span>
                  </td>

                  {/* Table */}
                  <td className="py-4 px-5">
                    <span className="px-2 py-1 bg-[#E6DEC4]/30 rounded-lg text-xs font-medium">
                      {getTableInfo(booking)}
                    </span>
                  </td>

                  {/* Notes */}
                  <td className="py-4 px-5 max-w-[180px]">
                    <p className="text-xs text-gray-600 truncate" title={booking.notes || ""}>
                      {booking.notes || "-"}
                    </p>
                  </td>

                  {/* Payment */}
                  <td className="py-4 px-5">
                    <div className="space-y-1.5">
                      {getPaymentBadge(getPaymentStatus(booking))}
                      {getDpAmount(booking) > 0 && (
                        <p className="text-xs text-[#96683E]">{formatCurrency(getDpAmount(booking))}</p>
                      )}
                      {getPaymentMethod(booking) && (
                        <p className="text-xs text-gray-400 capitalize">{getPaymentMethod(booking)}</p>
                      )}
                      {/* View payment proof */}
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
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">{getStatusBadge(booking.status)}</td>

                  {/* Actions */}
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      {booking.status?.toLowerCase() !== "confirmed" &&
                        booking.status?.toLowerCase() !== "cancelled" &&
                        booking.status?.toLowerCase() !== "canceled" && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              {updatingId === booking.id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      {booking.status?.toLowerCase() === "confirmed" && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                      )}
                      {(booking.status?.toLowerCase() === "cancelled" ||
                        booking.status?.toLowerCase() === "canceled") && (
                        <span className="text-xs text-red-600 font-medium">✗ Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            {/* Modal Header */}
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

            {/* Modal Body */}
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

            {/* Modal Footer */}
            {selectedBooking && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="text-sm">
                  <p className="text-gray-600">
                    DP: <span className="font-bold text-[#96683E]">{formatCurrency(getDpAmount(selectedBooking))}</span>
                  </p>
                </div>
                {selectedBooking.status?.toLowerCase() !== "confirmed" &&
                  selectedBooking.status?.toLowerCase() !== "cancelled" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "confirmed");
                          setPreviewUrl(null);
                          setSelectedBooking(null);
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "cancelled");
                          setPreviewUrl(null);
                          setSelectedBooking(null);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}