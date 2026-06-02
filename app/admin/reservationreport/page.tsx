"use client";

import { useState, useEffect } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

export default function LaporanReservasiPage() {
  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLaporan = async () => {
    setIsLoading(true);
    try {
      const token = await getCookies("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      
      const response = await fetch(`${baseUrl}/booking`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        cache: 'no-store',
      });

      const res = await response.json();
      if (res.success) {
        setLaporan(res.data);
      }
    } catch (error) {
      toast.error("Failed to load reservation report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handlePrint = () => {
    window.print(); 
  };

  return (
    <div className="p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-center">Reservation Report</h1>
          <p className="text-[#5C321A]/70 text-center">History of customer reservations.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-[#5C321A] text-white px-6 py-2 rounded-xl hover:bg-[#96683E] transition print:hidden"
        >
          Print Report
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#E6DEC4]/20 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Table</th>
              <th className="p-4">Guest Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5C321A]/10">
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : laporan.length > 0 ? (
              laporan.map((l: any) => (
                <tr key={l.id}>
                  <td className="p-4 font-mono text-xs">{l.id}</td>
                  <td className="p-4">{l.customer_name}</td>
                  <td className="p-4">{new Date(l.booking_date).toLocaleDateString()}</td>
                  <td className="p-4">{l.table_number}</td>
                  <td className="p-4 text-center">{l.guest_count}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-4 text-center">No data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}