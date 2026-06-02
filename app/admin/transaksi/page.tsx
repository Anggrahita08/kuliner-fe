"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";
import { RefreshCw, Eye, X, ChevronLeft, ChevronRight, Search, Download, Image as ImageIcon } from "lucide-react";

interface Transaction {
  id: number;
  bookingId: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  booking?: {
    id: number;
    date: string;
    time: string;
    guestCount: number;
    status: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    table?: {
      id: number;
      number: number;
    };
  };
}

interface PaymentProof {
  bookingId: number;
  paymentProof: string;
  paymentMethod: string;
  notes: string;
  uploadedAt: string;
}

export default function AdminTransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Coba dari endpoint booking dulu (paling aman)
      const response = await fetch(`${baseUrl}/booking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        cache: "no-store",
      });

      const data = await response.json();
      console.log("[transaksi fetch from booking]", data);

      let bookings: any[] = [];
      if (Array.isArray(data)) {
        bookings = data;
      } else if (Array.isArray(data?.data)) {
        bookings = data.data;
      } else if (Array.isArray(data?.list)) {
        bookings = data.list;
      } else if (Array.isArray(data?.bookings)) {
        bookings = data.bookings;
      }

      // Konversi booking ke format transaksi
      const extracted: Transaction[] = bookings.map((booking: any) => ({
        id: booking.id,
        bookingId: booking.id,
        total: 150000, // DP tetap 150k
        paymentMethod: booking.payment_method || booking.paymentMethod || "BANK_TRANSFER",
        status: booking.payment_status === "paid" || booking.paymentStatus === "paid" ? "PAID" : "UNPAID",
        createdAt: booking.createdAt || new Date().toISOString(),
        booking: {
          id: booking.id,
          date: booking.booking_date || booking.date || booking.bookingDate,
          time: booking.time,
          guestCount: booking.guest_count || booking.guestCount,
          status: booking.status,
          user: booking.user || { 
            name: booking.customer_name || booking.customerName, 
            email: booking.customer_email || booking.customerEmail 
          },
          table: booking.table,
        }
      }));

      setTransactions(extracted);
      
      // Load payment proofs dari localStorage
      const proofs: PaymentProof[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("payment_")) {
          const proofData = localStorage.getItem(key);
          if (proofData) {
            proofs.push(JSON.parse(proofData));
          }
        }
      }
      setPaymentProofs(proofs);
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === "PAID") {
      return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">✓ Paid</span>;
    }
    return <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Unpaid</span>;
  };

  const getBookingStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
    };
    const s = statusMap[status?.toLowerCase()] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.className}`}>{s.label}</span>;
  };

  const getPaymentProofForBooking = (bookingId: number) => {
    return paymentProofs.find(p => p.bookingId === bookingId);
  };

  const filteredTransactions = transactions.filter(t => {
    const customerName = t.booking?.user?.name || "";
    const customerEmail = t.booking?.user?.email || "";
    const search = searchTerm.toLowerCase();
    return customerName.toLowerCase().includes(search) || 
           customerEmail.toLowerCase().includes(search) ||
           t.bookingId.toString().includes(search);
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: transactions.length,
    paid: transactions.filter(t => t.status === "PAID").length,
    unpaid: transactions.filter(t => t.status !== "PAID").length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.total || 0), 0),
  };

  return (
    <div className="p-6 md:p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#5C321A]/10 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Transaksi Management</h1>
          <p className="text-[#96683E] text-sm mt-1">Manage customer payments and transactions</p>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#96683E] hover:bg-[#5C321A] text-white rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-[#96683E]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Unpaid</p>
          <p className="text-2xl font-bold text-red-600">{stats.unpaid}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#5C321A]/10 p-4">
          <p className="text-xs text-[#96683E] uppercase tracking-wider mb-1">Total DP</p>
          <p className="text-lg font-bold text-[#96683E]">{formatCurrency(stats.totalAmount)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#96683E]" />
          <input
            type="text"
            placeholder="Search by customer name, email, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#5C321A]/20 focus:outline-none focus:border-[#96683E] focus:ring-1 focus:ring-[#96683E] bg-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Booking ID</th>
              <th className="py-4 px-5">Date & Time</th>
              <th className="py-4 px-5">Guests</th>
              <th className="py-4 px-5">DP Amount</th>
              <th className="py-4 px-5">Payment Status</th>
              <th className="py-4 px-5">Booking Status</th>
              <th className="py-4 px-5 text-center">Bukti Bayar</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-[#5C321A]/10 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#96683E] mx-auto" />
                  <p className="mt-3">Loading transactions...</p>
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <p className="text-4xl mb-3">💰</p>
                  <p className="font-medium">No transactions found</p>
                  <p className="text-xs mt-1">Transactions will appear here once customers complete bookings</p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => {
                const paymentProof = getPaymentProofForBooking(transaction.bookingId);
                return (
                  <tr key={transaction.id} className="hover:bg-[#E6DEC4]/5 transition">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#5C321A]">{transaction.booking?.user?.name || "Guest"}</p>
                      <p className="text-xs text-[#96683E]">{transaction.booking?.user?.email || "-"}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{transaction.bookingId}</span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-medium">{formatDate(transaction.booking?.date)}</p>
                      <p className="text-xs text-[#96683E]">{transaction.booking?.time || "-"}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium">{transaction.booking?.guestCount || "-"}</span>
                      <span className="text-xs text-gray-500 ml-1">pax</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-[#96683E]">{formatCurrency(transaction.total)}</span>
                    </td>
                    <td className="py-4 px-5">
                      {getPaymentStatusBadge(transaction.status)}
                    </td>
                    <td className="py-4 px-5">
                      {getBookingStatusBadge(transaction.booking?.status || "")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {paymentProof ? (
                        <button
                          onClick={() => setSelectedProof(paymentProof)}
                          className="flex items-center gap-1 mx-auto text-[#96683E] hover:text-[#5C321A] underline transition"
                        >
                          <Eye size={16} /> Lihat
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Tidak ada</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#5C321A]/10">
            <p className="text-xs text-[#96683E]">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#5C321A]/20 text-[#96683E] hover:bg-[#E6DEC4]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-[#96683E]">
                Page {currentPage} of {totalPages}
              </span>
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
      {selectedProof && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProof(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-xl text-[#4A3525]">Bukti Pembayaran</h3>
                <p className="text-xs text-[#96683E] mt-0.5">Booking #{selectedProof.bookingId}</p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              {/* Image Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-center">
                {selectedProof.paymentProof ? (
                  <img
                    src={selectedProof.paymentProof}
                    alt="Payment proof"
                    className="max-w-full max-h-80 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No image available</p>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#E6DEC4]">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="font-semibold text-[#5C321A] capitalize">{selectedProof.paymentMethod}</span>
                </div>
                {selectedProof.notes && (
                  <div className="pb-2 border-b border-[#E6DEC4]">
                    <span className="text-sm text-gray-600 block mb-1">Notes</span>
                    <p className="text-sm text-[#5C321A]">{selectedProof.notes}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Uploaded At</span>
                  <span className="text-xs text-[#96683E]">{new Date(selectedProof.uploadedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  if (selectedProof.paymentProof) {
                    const link = document.createElement("a");
                    link.href = selectedProof.paymentProof;
                    link.download = `payment_${selectedProof.bookingId}.png`;
                    link.click();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#96683E] text-[#96683E] hover:bg-[#E6DEC4]/30 transition flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => setSelectedProof(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#96683E] hover:bg-[#5C321A] text-white transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}