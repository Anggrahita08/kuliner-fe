"use client";

import { useState, useEffect } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

interface Menu {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
}

export default function OrderPage() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = await getCookies("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
        });
        const res = await response.json();
        if (res.success) setMenu(res.data);
      } catch (error) {
        toast.error("Gagal memuat menu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="p-8 bg-[#FDFBF7] min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-[#4A3525]">Our Menu</h1>
        <p className="text-[#9C6D44] font-sans mt-2">Daftar hidangan spesial dari The Neighbourhood</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#4A3525]">Memuat katalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {menu.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white p-6 rounded-2xl border border-[#9C6D44]/10 shadow-sm hover:border-[#9C6D44]/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-xl text-[#4A3525]">{item.name}</h3>
                <span className="text-[#96683E] font-semibold text-sm">
                  Rp {item.price.toLocaleString()}
                </span>
              </div>
              
              <div className="inline-block bg-[#EFE9D3]/50 text-[#4A3525] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                {item.category}
              </div>
              
              <p className="text-[#9C6D44] text-sm leading-relaxed">
                {item.description || "Hidangan pilihan yang disajikan dengan bahan berkualitas terbaik."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}