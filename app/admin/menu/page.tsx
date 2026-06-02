"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCookies } from "@/helper/cookies";
import Dropmenu from "./drop";
import { toast } from "react-toastify";

interface MenuItem {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image?: string;
  imageUrl?: string;
}

export default function AdminMenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fetchMenuData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await getCookies("token_kuliner");
      
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
      const menuData = res.data || res || [];
      
      // Process menu items to ensure image field is accessible
      const processedData = menuData.map((item: any) => ({
        ...item,
        image: item.image || item.imageUrl || item.img || null
      }));
      
      setMenuItems(processedData);
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

  const handleImageError = (itemId: string | number) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getImageUrl = (item: MenuItem): string | null => {
    if (imageErrors[item.id]) return null;
    return item.image || item.imageUrl || null;
  };

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
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#E6DEC4]/20 border-b text-xs font-bold uppercase text-[#5C321A]/80">
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Item Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">Loading...</td>
              </tr>
            ) : menuItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No menu available. Please add a new menu item.
                </td>
              </tr>
            ) : (
              menuItems.map((item) => {
                const imageUrl = getImageUrl(item);
                return (
                  <tr key={item.id} className="hover:bg-[#E6DEC4]/5 transition-colors">
                    <td className="py-4 px-6">
                      {imageUrl ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E6DEC4]/20">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#E6DEC4]/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#5C321A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#5C321A]">{item.name}</p>
                        {item.id && (
                          <p className="text-xs text-[#5C321A]/40 mt-0.5">ID: {item.id}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E6DEC4]/30 rounded-full text-xs font-medium">
                        {item.category === "Appetizer" && "🍽️"}
                        {item.category === "Main Course" && "🍖"}
                        {item.category === "Dessert" && "🍰"}
                        {item.category === "Drink" && "🥤"}
                        {item.category === "Snack" && "🍿"}
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono font-semibold text-[#96683E]">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </span>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-[#5C321A]/10 text-center">
          <div className="text-2xl font-bold text-[#96683E]">{menuItems.length}</div>
          <div className="text-xs text-[#5C321A]/60 uppercase mt-1">Total Items</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#5C321A]/10 text-center">
          <div className="text-2xl font-bold text-[#96683E]">
            {menuItems.filter(item => item.category === "Appetizer").length}
          </div>
          <div className="text-xs text-[#5C321A]/60 uppercase mt-1">Appetizers</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#5C321A]/10 text-center">
          <div className="text-2xl font-bold text-[#96683E]">
            {menuItems.filter(item => item.category === "Main Course").length}
          </div>
          <div className="text-xs text-[#5C321A]/60 uppercase mt-1">Main Course</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#5C321A]/10 text-center">
          <div className="text-2xl font-bold text-[#96683E]">
            {menuItems.filter(item => item.category === "Dessert").length}
          </div>
          <div className="text-xs text-[#5C321A]/60 uppercase mt-1">Desserts</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#5C321A]/10 text-center">
          <div className="text-2xl font-bold text-[#96683E]">
            {menuItems.filter(item => item.category === "Drink" || item.category === "Snack").length}
          </div>
          <div className="text-xs text-[#5C321A]/60 uppercase mt-1">Drinks & Snacks</div>
        </div>
      </div>
    </div>
  );
}