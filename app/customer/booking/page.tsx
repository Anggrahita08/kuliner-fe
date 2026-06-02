"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

export default function CustomerBookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Time slots
  const timeSlots = ["11:00", "12:00", "13:00", "14:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

  // Available dates (next 7 days)
  const dates = [
    { day: "Mon", date: "Jun 2", full: "Monday, June 2, 2026", iso: "2026-06-02" },
    { day: "Tue", date: "Jun 3", full: "Tuesday, June 3, 2026", iso: "2026-06-03" },
    { day: "Wed", date: "Jun 4", full: "Wednesday, June 4, 2026", iso: "2026-06-04" },
    { day: "Thu", date: "Jun 5", full: "Thursday, June 5, 2026", iso: "2026-06-05" },
    { day: "Fri", date: "Jun 6", full: "Friday, June 6, 2026", iso: "2026-06-06" },
    { day: "Sat", date: "Jun 7", full: "Saturday, June 7, 2026", iso: "2026-06-07" },
    { day: "Sun", date: "Jun 8", full: "Sunday, June 8, 2026", iso: "2026-06-08" },
  ];

  // Set default selected date
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].full);
    }
  }, []);

  // Get user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getCookies("token_kuliner");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const response = await fetch(`${baseUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
        });
        
        const data = await response.json();
        if (response.ok) {
          setUserProfile(data.data || data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const formatDateForApi = (dateFull: string) => {
    const dateObj = dates.find(d => d.full === dateFull);
    return dateObj ? dateObj.iso : dates[0].iso;
  };

  const handleContinue = () => {
    if (!selectedTime) {
      toast.error("Silakan pilih waktu");
      return;
    }

    // Simpan data booking ke localStorage untuk dilanjutkan ke payment
    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      guests: guests,
    };
    
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/customer/booking/payment");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#4A3525] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Book Your Table</h1>
          <p className="text-[#D4C5B0]">Reserve your perfect dining experience</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-[#96683E] font-bold">
            <span className="bg-[#96683E] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
            <span>Select Time</span>
          </div>
          <div className="w-16 h-px bg-[#96683E]/30"></div>
          <div className="flex items-center gap-2 text-[#4A3525]/40 font-bold">
            <span className="border-2 border-[#4A3525]/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
            <span>Confirm</span>
          </div>
        </div>

        {/* User Info */}
        {userProfile && (
          <div className="mb-6 p-3 bg-[#EFE9D3]/30 rounded-lg">
            <p className="text-sm text-[#96683E]">
              Booking as: <span className="font-bold text-[#5C321A]">{userProfile.name || userProfile.email}</span>
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
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
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Time Selection */}
            <div className="bg-white rounded-xl border border-[#96683E]/20 shadow-sm overflow-hidden">
              <div className="bg-[#EFE9D3]/30 px-6 py-4 border-b border-[#96683E]/20">
                <h3 className="font-bold text-[#4A3525]">Select Time</h3>
                <p className="text-xs text-[#96683E]">Choose your preferred time</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg text-center font-medium transition ${
                        selectedTime === time
                          ? "bg-[#96683E] text-white shadow-md"
                          : "bg-[#FDFBF7] border border-[#96683E]/20 text-[#4A3525] hover:bg-[#EFE9D3]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Summary */}
            {(selectedTime || selectedDate) && (
              <div className="bg-[#EFE9D3]/30 rounded-xl p-4 border border-[#96683E]/20">
                <p className="text-xs font-bold text-[#96683E] uppercase tracking-wider mb-2">Your Selection</p>
                <div className="space-y-2 text-sm">
                  {selectedTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#96683E]" />
                      <span>{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#96683E]" />
                    <span>{guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#96683E]" />
                    <span>{selectedDate.split(",")[0]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedTime}
              className="w-full bg-[#96683E] hover:bg-[#5C321A] disabled:bg-[#D4C5B0] disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              Continue to Confirm
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}