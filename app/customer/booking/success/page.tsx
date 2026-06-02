"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-[#96683E]/20 shadow-sm max-w-md w-full text-center">
        <CheckCircle2 size={64} className="text-green-600 mx-auto mb-6" />
        <h1 className="text-2xl font-serif font-bold text-[#4A3525] mb-2">Booking Confirmed!</h1>
        <p className="text-[#96683E] mb-4">
          Your reservation has been created successfully!
        </p>
        <p className="text-sm text-[#4A3525]/70 mb-6">
          Status: <span className="text-yellow-600 font-bold">Pending</span><br/>
          Our admin will verify your booking shortly.
        </p>
        
        <div className="space-y-3">
          <Link href="/customer/reservationreport">
            <button className="w-full bg-[#4A3525] text-white py-3 rounded-lg font-bold hover:bg-[#2e2117] transition">
              View My Reservations
            </button>
          </Link>
          <Link href="/customer/dashboard">
            <button className="w-full bg-[#96683E] text-white py-3 rounded-lg font-bold hover:bg-[#5C321A] transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}