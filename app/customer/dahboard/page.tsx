"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function BookingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-8 bg-[#FDFBF7] min-h-screen text-[#4A3525]">
      {/* Header Stepper */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <div className={`flex items-center gap-2 ${step === 1 ? 'font-bold' : 'opacity-50'}`}>
          <div className="bg-[#9C6D44] text-white w-8 h-8 rounded-full flex items-center justify-center">1</div>
          <span>Select Time</span>
        </div>
        <div className="w-12 h-[1px] bg-[#9C6D44]"></div>
        <div className={`flex items-center gap-2 ${step === 2 ? 'font-bold' : 'opacity-50'}`}>
          <div className="bg-[#EFE9D3] text-[#4A3525] w-8 h-8 rounded-full flex items-center justify-center">2</div>
          <span>Confirm & Pay</span>
        </div>
      </div>

      {/* Konten Berdasarkan Step */}
      {step === 1 ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-[#9C6D44]/10 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Select Your Reservation</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <select className="p-3 border rounded-lg bg-transparent"><option>2 Guests</option></select>
            <select className="p-3 border rounded-lg bg-transparent"><option>Tue, Jun 2</option></select>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {["11:00", "12:00", "13:00"].map((time) => (
              <div key={time} className="p-3 border rounded-lg hover:border-[#9C6D44] cursor-pointer text-sm">
                <div className="font-bold">{time}</div>
                <div className="text-[10px] text-gray-500">Non-Smoking</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="mt-8 w-full bg-[#4A3525] text-white py-3 rounded-lg">Next</button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-[#9C6D44]/10 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Complete Your Reservation</h2>
          <div className="bg-[#FDFBF7] p-4 rounded-lg mb-6 text-sm grid grid-cols-2 gap-4">
            <div><p className="text-[#9C6D44]">Date</p><p className="font-bold">Tue, Jun 2</p></div>
            <div><p className="text-[#9C6D44]">Time</p><p className="font-bold">11:00</p></div>
          </div>
          
          <div className="space-y-3 mb-8">
            {["Bank Transfer", "E-Wallet", "Credit Card"].map((method) => (
              <label key={method} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-stone-50">
                <input type="radio" name="pay" className="mr-3" /> {method}
              </label>
            ))}
          </div>
          <button onClick={() => alert("Payment Success & Booking Status: Pending!")} className="w-full bg-[#9C6D44] text-white py-4 rounded-lg font-bold">
            Pay DP & Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}