"use client";

import { useEffect, useState, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import { Clock, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

interface Reservation {
  id: number;
  booking_date: string;
  table_number: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: string;
  customer_name?: string;
  customer_phone?: string;
  guests: number;
  time: string;
}

export default function ReservationReport() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = "https://be-kuliner-production.up.railway.app";

      const response = await fetch(`${baseUrl}/reservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const res = await response.json();
      setReservations(res.data || res || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservation data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleConfirmBooking = async (id: number) => {
    setConfirmingId(id);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = "https://be-kuliner-production.up.railway.app";

      const response = await fetch(`${baseUrl}/reservations/${id}/confirm`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm booking");
      }

      toast.success("Booking confirmed successfully!");
      fetchReservations(); // Refresh data
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to confirm booking");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setConfirmingId(id);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = "https://be-kuliner-production.up.railway.app";

      const response = await fetch(`${baseUrl}/reservations/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully!");
      fetchReservations(); // Refresh data
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setConfirmingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
            <Clock size={14} /> PENDING
          </span>
        );
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
            <CheckCircle2 size={14} /> CONFIRMED
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
            <XCircle size={14} /> CANCELLED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-fit text-xs font-bold">
            <AlertCircle size={14} /> UNKNOWN
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status?.toLowerCase() === 'success') {
      return <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded">SUCCESS</span>;
    }
    return <span className="text-yellow-700 font-bold text-xs bg-yellow-100 px-2 py-1 rounded">PENDING</span>;
  };

  return (
    <div className="p-8 bg-[#FDFBF7] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3525] mb-2">Reservation Report</h1>
          <p className="text-[#9C6D44]">Manage and confirm customer reservations</p>
        </div>
        <button
          onClick={fetchReservations}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#96683E] hover:bg-[#5C321A] text-white rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#9C6D44]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-[#EFE9D3]/30">
            <tr>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">ID Booking</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Customer</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Date</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Time</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Guests</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Table</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Payment</th>
              <th className="p-4 text-xs font-bold text-[#4A3525] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#9C6D44]/10">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#96683E] mx-auto"></div>
                  <p className="mt-2">Loading reservations...</p>
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-[#EFE9D3]/10 transition">
                  <td className="p-4 font-bold text-[#4A3525]">#{reservation.id}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-[#4A3525]">{reservation.customer_name || "Guest"}</p>
                      <p className="text-xs text-[#9C6D44]">{reservation.customer_phone || "-"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[#96683E]">{reservation.booking_date || "-"}</td>
                  <td className="p-4 text-[#96683E]">{reservation.time || "-"}</td>
                  <td className="p-4 text-[#96683E]">{reservation.guests || 2} person(s)</td>
                  <td className="p-4 text-[#96683E]">{reservation.table_number || "-"}</td>
                  <td className="p-4">{getStatusBadge(reservation.status)}</td>
                  <td className="p-4">{getPaymentBadge(reservation.payment_status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(reservation.id)}
                            disabled={confirmingId === reservation.id}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                          >
                            {confirmingId === reservation.id ? "..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => handleCancelBooking(reservation.id)}
                            disabled={confirmingId === reservation.id}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                      )}
                      {reservation.status === 'cancelled' && (
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-[#9C6D44]/10 p-4">
          <p className="text-xs text-[#9C6D44] uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#9C6D44]/10 p-4">
          <p className="text-xs text-[#9C6D44] uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {reservations.filter(r => r.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#9C6D44]/10 p-4">
          <p className="text-xs text-[#9C6D44] uppercase tracking-wider">Total Reservations</p>
          <p className="text-2xl font-bold text-[#4A3525]">{reservations.length}</p>
        </div>
      </div>
    </div>
  );
}