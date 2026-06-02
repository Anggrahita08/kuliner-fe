"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";
import Dropmenu from "./drop";
import { toast } from "react-toastify";

interface MenuItem {
  id: number | string;
  name: string;
  category: string;
  price: number;
}

export default function AdminMenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await getCookies("token");
      
      if (!token) {
        setError("Token not found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const res = await response.json();
      setMenuItems(res.data || res || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError("Failed to fetch menu data.");
      toast.error("Failed to load menu data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  if (error) {
    return (
      <div className="p-6 md:p-8 bg-[#FDFBF7] min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchMenuData} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      <div className="flex justify-between items-center border-b border-[#5C321A]/10 pb-6">
        <h1 className="text-3xl font-serif font-bold">Restaurant Menu</h1>
        <Link href="/admin/menu/add" className="bg-[#96683E] hover:bg-[#5C321A] text-white px-5 py-3 rounded-xl transition">
          + Add New Menu
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#5C321A]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-6">Item Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">Loading...</td>
              </tr>
            ) : menuItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">
                  No menu available. Please add a new menu item.
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#E6DEC4]/5">
                  <td className="py-4 px-6 font-semibold">{item.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-[#E6DEC4]/30 rounded-full text-xs font-medium">
                      {item.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <Link 
                        href={`/admin/menu/edit/${item.id}`} 
                        className="bg-[#E6DEC4] hover:bg-[#d4caae] px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        Edit
                      </Link>
                      <Dropmenu id={item.id} onRefresh={fetchMenuData} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}