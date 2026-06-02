"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Calendar, Clock, Users, MapPin, Loader2, Upload, X, Image as ImageIcon, Copy, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [isOccasionOpen, setIsOccasionOpen] = useState(false);
  const [isDietaryOpen, setIsDietaryOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [dietaryNote, setDietaryNote] = useState("");
  const [otherOccasion, setOtherOccasion] = useState("");
  const [copied, setCopied] = useState(false);

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: 2,
    seating: "",
    table_number: "",
    tableId: null as number | null,
  });

  useEffect(() => {
    const savedBooking = localStorage.getItem("bookingData");
    if (savedBooking) {
      const parsed = JSON.parse(savedBooking);
      setBookingData(parsed);
    } else {
      router.push("/customer/booking");
    }
  }, [router]);

  const occasions = ["Birthday", "Anniversary", "Business Dinner", "Date Night", "Family Gathering", "Other"];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setPaymentProof(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setPaymentProof(null);
    setPaymentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Konversi date ke format ISO YYYY-MM-DD
  const convertToISODate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split("T")[0];
      }
      return date.toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const handleConfirmBooking = async () => {
    if (!paymentProof) {
      toast.error("Please upload your payment proof / transfer receipt");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const finalOccasion = selectedOccasion === "Other" ? otherOccasion : selectedOccasion;
      const isoDate = convertToISODate(bookingData.date);

      if (!isoDate) throw new Error("Invalid date format");
      if (!bookingData.time) throw new Error("Time is required");
      if (!bookingData.guests || bookingData.guests <= 0) throw new Error("Guest count is required");

      // Pastikan tableId selalu integer valid — coba dari tableId, lalu table_number, fallback ke 1
      const rawTableId = bookingData.tableId ?? (bookingData.table_number !== "" ? Number(bookingData.table_number) : null);
      const tableId = Number.isInteger(rawTableId) && (rawTableId as number) > 0 ? rawTableId : 1;

      // Gabungkan occasion dan dietary note jadi notes
      const notesParts = [];
      if (finalOccasion) notesParts.push(`Occasion: ${finalOccasion}`);
      if (dietaryNote) notesParts.push(`Dietary: ${dietaryNote}`);
      const notes = notesParts.join(" | ");

      // Hanya kirim 4 field yang ada di CreateBookingDto backend
      // notes, paymentMethod, dpAmount, status TIDAK ada di DTO → direject NestJS ValidationPipe
      const requestBody = {
        date: isoDate,
        time: bookingData.time,
        guestCount: Number(bookingData.guests),
        tableId: Number(tableId),
      };

      console.log("Sending booking request:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${baseUrl}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("Booking response status:", response.status);
      console.log("Booking response data:", JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        const errorMessage =
          responseData.message || responseData.error || `HTTP ${response.status}: Failed to create booking`;
        throw new Error(errorMessage);
      }

      // Ambil bookingId dari berbagai kemungkinan struktur response
      const bookingId =
        responseData.data?.id ||
        responseData.data?.bookingId ||
        responseData.id ||
        responseData.bookingId;

      console.log("Booking ID:", bookingId);

      if (!bookingId) {
        console.warn("No booking ID found in response, skipping payment proof upload");
        toast.warning("Booking created but could not upload payment proof. Please contact support.");
      }

      // Upload payment proof
      if (bookingId && paymentProof) {
        const proofFormData = new FormData();
        proofFormData.append("payment_proof", paymentProof);
        proofFormData.append("booking_id", bookingId.toString());

        console.log("Uploading payment proof for booking:", bookingId);

        const proofResponse = await fetch(`${baseUrl}/booking/${bookingId}/payment-proof`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            // Jangan set Content-Type di sini, biarkan browser yang set boundary untuk FormData
          },
          body: proofFormData,
        });

        const proofData = await proofResponse.json().catch(() => null);
        console.log("Payment proof response:", proofResponse.status, proofData);

        if (!proofResponse.ok) {
          console.warn("Payment proof upload failed:", proofData);
          toast.warning("Booking created but payment proof upload failed. Please re-upload manually.");
        } else {
          console.log("Payment proof uploaded successfully");
        }
      }

      localStorage.setItem("lastBookingId", bookingId?.toString() || "");
      localStorage.removeItem("bookingData");

      toast.success("Booking created successfully! Waiting for admin confirmation.");
      router.push("/customer/booking/success");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#4A3525] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Confirm & Pay</h1>
          <p className="text-[#D4C5B0]">Complete your reservation with down payment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-[#96683E] font-bold">
            <span className="bg-[#96683E] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            <span className="hidden sm:inline">Select Time</span>
          </div>
          <div className="w-16 h-px bg-[#96683E]/30"></div>
          <div className="flex items-center gap-2 text-[#96683E] font-bold">
            <span className="bg-[#96683E] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            <span className="hidden sm:inline">Confirm & Pay</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#96683E]/20 shadow-sm overflow-hidden">
          {/* Reservation Summary */}
          <div className="p-6 border-b border-[#96683E]/10">
            <h2 className="font-bold text-lg text-[#4A3525] mb-4">Reservation Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#96683E] mt-0.5" />
                <div>
                  <p className="text-[#96683E] text-xs uppercase">Date</p>
                  <p className="font-bold">{bookingData.date || "-"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#96683E] mt-0.5" />
                <div>
                  <p className="text-[#96683E] text-xs uppercase">Time</p>
                  <p className="font-bold">{bookingData.time || "-"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[#96683E] mt-0.5" />
                <div>
                  <p className="text-[#96683E] text-xs uppercase">Guests</p>
                  <p className="font-bold">{bookingData.guests} people</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#96683E] mt-0.5" />
                <div>
                  <p className="text-[#96683E] text-xs uppercase">Seating</p>
                  <p className="font-bold">{bookingData.seating || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="p-6 border-b border-[#96683E]/10 bg-[#EFE9D3]/20">
            <h3 className="font-bold text-[#4A3525] mb-3 flex items-center gap-2">
              <span className="text-xl">🏦</span> Bank Transfer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#96683E]/10">
                <span className="text-[#4A3525]">Bank BCA</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#96683E]">1234 5678 90</span>
                  <button
                    onClick={handleCopyAccount}
                    className="text-[#96683E] hover:text-[#4A3525] transition"
                    title="Copy account number"
                  >
                    {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#96683E]/10">
                <span className="text-[#4A3525]">Account Name</span>
                <span className="font-bold">The Neighbourhood Resto</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#96683E]/10">
                <span className="text-[#4A3525]">Amount to Transfer</span>
                <span className="font-bold text-[#96683E]">Rp 150.000</span>
              </div>
            </div>
            <p className="text-xs text-[#96683E] mt-3 text-center">
              Please transfer the DP amount and upload your payment proof below
            </p>
          </div>

          {/* Upload Payment Proof */}
          <div className="p-6 border-b border-[#96683E]/10">
            <h3 className="font-bold text-[#4A3525] mb-1 flex items-center gap-2">
              <Upload size={18} /> Upload Payment Proof <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-[#96683E] mb-4">
              Upload your transfer receipt or payment screenshot (Max 5MB, JPG/PNG)
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {!paymentPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#96683E]/30 rounded-xl p-8 text-center cursor-pointer hover:border-[#96683E] hover:bg-[#EFE9D3]/10 transition bg-[#FDFBF7]"
              >
                <ImageIcon className="w-12 h-12 text-[#96683E]/50 mx-auto mb-3" />
                <p className="text-[#96683E] font-medium">Click to upload payment proof</p>
                <p className="text-xs text-[#4A3525]/50 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={paymentPreview}
                  alt="Payment proof preview"
                  className="w-full max-h-64 object-contain rounded-xl border border-[#96683E]/20 bg-[#FDFBF7] p-2"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition shadow-md"
                >
                  <X size={16} />
                </button>
                <p className="text-xs text-green-600 mt-2 text-center font-medium">
                  ✓ Payment proof uploaded — {paymentProof?.name}
                </p>
              </div>
            )}
          </div>

          {/* Special Occasion & Dietary */}
          <div className="p-6 border-b border-[#96683E]/10 space-y-4">
            <div className="border border-[#96683E]/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsOccasionOpen(!isOccasionOpen)}
                className="w-full flex justify-between items-center p-4 text-sm font-semibold text-[#4A3525] hover:bg-[#EFE9D3]/30 transition"
              >
                <span>🎉 Is this a Special Occasion?</span>
                <ChevronDown className={`transition-transform ${isOccasionOpen ? "rotate-180" : ""}`} size={18} />
              </button>
              {isOccasionOpen && (
                <div className="p-4 pt-0 border-t border-[#96683E]/10">
                  <div className="flex flex-wrap gap-2 mt-3">
                    {occasions.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => setSelectedOccasion(selectedOccasion === occ ? "" : occ)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                          selectedOccasion === occ
                            ? "bg-[#96683E] text-white"
                            : "bg-[#EFE9D3] hover:bg-[#96683E]/20 text-[#4A3525]"
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                  {selectedOccasion === "Other" && (
                    <input
                      type="text"
                      value={otherOccasion}
                      onChange={(e) => setOtherOccasion(e.target.value)}
                      placeholder="Please specify your occasion..."
                      className="mt-3 w-full p-2 border border-[#96683E]/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#96683E]"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#96683E]/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsDietaryOpen(!isDietaryOpen)}
                className="w-full flex justify-between items-center p-4 text-sm font-semibold text-[#4A3525] hover:bg-[#EFE9D3]/30 transition"
              >
                <span>🥗 Dietary Restrictions?</span>
                <ChevronDown className={`transition-transform ${isDietaryOpen ? "rotate-180" : ""}`} size={18} />
              </button>
              {isDietaryOpen && (
                <div className="p-4 pt-0 border-t border-[#96683E]/10">
                  <textarea
                    value={dietaryNote}
                    onChange={(e) => setDietaryNote(e.target.value)}
                    placeholder="e.g., Allergic to nuts, Vegetarian, Gluten-free..."
                    rows={3}
                    className="w-full p-3 border border-[#96683E]/20 rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#96683E]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6">
            <p className="font-bold text-[#4A3525] mb-3">Select Payment Method</p>
            <div className="space-y-3 mb-6">
              {[
                { id: "bank", label: "🏦 Bank Transfer", desc: "BCA, Mandiri, BNI, BRI" },
                { id: "wallet", label: "📱 E-Wallet", desc: "GoPay, OVO, DANA" },
                { id: "credit", label: "💳 Credit Card", desc: "Visa, Mastercard" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition ${
                    paymentMethod === method.id
                      ? "border-[#96683E] bg-[#EFE9D3]/20"
                      : "border-[#96683E]/15 hover:bg-[#EFE9D3]/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold block">{method.label}</span>
                    <p className="text-xs text-[#96683E]">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* DP Summary */}
            <div className="bg-[#FDFBF7] p-4 rounded-lg border border-[#96683E]/20 mb-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="font-bold text-[#4A3525]">Down Payment (DP)</p>
                  <p className="text-xs text-[#96683E]">Secures your reservation</p>
                </div>
                <p className="text-2xl font-bold text-[#96683E]">Rp 150.000</p>
              </div>
            </div>

            {/* Validation warning */}
            {!paymentProof && (
              <p className="text-xs text-red-500 mb-3 text-center">
                ⚠️ Please upload your payment proof before confirming
              </p>
            )}

            <button
              onClick={handleConfirmBooking}
              disabled={isLoading || !paymentProof}
              className="w-full bg-[#96683E] hover:bg-[#5C321A] text-white py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                "Confirm & Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  ):
}