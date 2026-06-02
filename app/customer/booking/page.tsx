"use client";

import { useState } from "react";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SelectTimePage() {
  const router = useRouter();
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState("Tue, Jun 2");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeating, setSelectedSeating] = useState<string | null>(null);

  // Time slots
  const timeSlots = ["11:00", "12:00", "13:00", "14:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
  
  // Seating options for each time
  const seatingOptions = ["Non-Smoking", "Smoking", "Outdoor"];

  // Available dates (next 7 days)
  const dates = [
    { day: "Mon", date: "Jun 1", full: "Monday, June 1, 2025" },
    { day: "Tue", date: "Jun 2", full: "Tuesday, June 2, 2025" },
    { day: "Wed", date: "Jun 3", full: "Wednesday, June 3, 2025" },
    { day: "Thu", date: "Jun 4", full: "Thursday, June 4, 2025" },
    { day: "Fri", date: "Jun 5", full: "Friday, June 5, 2025" },
    { day: "Sat", date: "Jun 6", full: "Saturday, June 6, 2025" },
    { day: "Sun", date: "Jun 7", full: "Sunday, June 7, 2025" },
  ];

  const handleConfirm = () => {
    if (!selectedTime || !selectedSeating) {
      alert("Please select both time and seating preference");
      return;
    }

    // Save booking data to localStorage for payment page
    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      guests: guests,
      seating: selectedSeating,
      table_number: `${selectedSeating.substring(0, 2)}-${Math.floor(Math.random() * 20) + 1}`
    };
    
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/customer/booking/payment");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#4A3525] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Book Your Table</h1>
          <p className="text-[#D4C5B0]">Reserve your perfect dining experience</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-[#96683E] font-bold">
            <span className="bg-[#96683E] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
            <span className="hidden sm:inline">Select Time</span>
          </div>
          <div className="w-16 h-px bg-[#96683E]/30"></div>
          <div className="flex items-center gap-2 text-[#4A3525]/40 font-bold">
            <span className="border-2 border-[#4A3525]/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
            <span className="hidden sm:inline">Confirm & Pay</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Selection Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guests Selection */}
            <div className="bg-white rounded-xl border border-[#96683E]/20 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#96683E]/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#96683E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A3525]">Number of Guests</h3>
                  <p className="text-xs text-[#96683E]">Select party size</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#FDFBF7] rounded-lg p-3 border border-[#96683E]/10">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-[#96683E]/20 text-[#96683E] font-bold hover:bg-[#96683E] hover:text-white transition"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-[#4A3525]">{guests}</span>
                <button 
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-10 h-10 rounded-full bg-white border border-[#96683E]/20 text-[#96683E] font-bold hover:bg-[#96683E] hover:text-white transition"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-[#4A3525]/50 mt-2 text-center">
                {guests === 1 ? "1 person" : `${guests} people`}
              </p>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-xl border border-[#96683E]/20 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#96683E]/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#96683E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A3525]">Select Date</h3>
                  <p className="text-xs text-[#96683E]">Choose your preferred date</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {dates.map((date) => (
                  <button
                    key={date.full}
                    onClick={() => setSelectedDate(date.full)}
                    className={`p-3 rounded-lg text-center transition ${
                      selectedDate === date.full
                        ? "bg-[#96683E] text-white"
                        : "bg-[#FDFBF7] border border-[#96683E]/20 text-[#4A3525] hover:bg-[#EFE9D3]"
                    }`}
                  >
                    <div className="font-bold text-sm">{date.day}</div>
                    <div className="text-xs">{date.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Summary */}
            {(selectedTime || selectedSeating) && (
              <div className="bg-[#EFE9D3]/30 rounded-xl p-4 border border-[#96683E]/20">
                <p className="text-xs font-bold text-[#96683E] uppercase tracking-wider mb-2">Your Selection</p>
                <div className="space-y-1 text-sm">
                  {selectedTime && <p>⏰ Time: <span className="font-bold">{selectedTime}</span></p>}
                  {selectedSeating && <p>💺 Seating: <span className="font-bold">{selectedSeating}</span></p>}
                  <p>👥 Guests: <span className="font-bold">{guests} people</span></p>
                  <p>📅 Date: <span className="font-bold">{selectedDate.split(",")[0]}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Time & Seating Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#96683E]/20 shadow-sm overflow-hidden">
              <div className="bg-[#EFE9D3]/30 px-6 py-4 border-b border-[#96683E]/20">
                <h3 className="font-bold text-[#4A3525]">Select Time & Seating</h3>
                <p className="text-xs text-[#96683E]">Choose your preferred time and table location</p>
              </div>
              
              <div className="p-6">
                {/* Time Grid */}
                <div className="space-y-4">
                  {timeSlots.map((time) => (
                    <div key={time} className="border border-[#96683E]/10 rounded-lg overflow-hidden">
                      {/* Time Header */}
                      <div className="bg-[#FDFBF7] px-4 py-2 border-b border-[#96683E]/10">
                        <span className="font-bold text-[#96683E]">{time}</span>
                      </div>
                      {/* Seating Options for this time */}
                      <div className="grid grid-cols-3 divide-x divide-[#96683E]/10">
                        {seatingOptions.map((seating) => {
                          const isSelected = selectedTime === time && selectedSeating === seating;
                          return (
                            <button
                              key={`${time}-${seating}`}
                              onClick={() => {
                                setSelectedTime(time);
                                setSelectedSeating(seating);
                              }}
                              className={`p-4 text-center transition ${
                                isSelected
                                  ? "bg-[#96683E] text-white"
                                  : "bg-white text-[#4A3525] hover:bg-[#EFE9D3]"
                              }`}
                            >
                              <div className="text-sm font-medium">{seating}</div>
                              {isSelected && (
                                <div className="text-xs mt-1 opacity-80">✓ Selected</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={!selectedTime || !selectedSeating}
                className="bg-[#96683E] hover:bg-[#5C321A] disabled:bg-[#D4C5B0] disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 shadow-md"
              >
                Confirm & Pay
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}