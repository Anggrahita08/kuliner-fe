"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";

export default function AddMenuPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    category: "Food" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Menu name must be filled");
      return;
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Price must be a positive number");
      return;
    }
    
    if (!formData.category.trim()) {
      alert("Category must be filled");
      return;
    }
    
    setIsLoading(true);

    try {
      const token = await getCookies("token_kuliner");
      const baseUrl = "https://be-kuliner-production.up.railway.app";

      const response = await fetch(`${baseUrl}/menu`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
        }),
      });

      if (response.ok) {
        alert("Menu successfully added!");
        router.push("/admin/menu");
      } else {
        const errorText = await response.text();
        alert(`Failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Connection issue";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
      <div className="max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-center">Add New Menu</h1>
        <p className="text-[#5C321A]/70 mt-2 text-center">Add a new menu item to your restaurant's menu.</p>
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-[#5C321A]/10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">Item Name</label>
            <input 
              required 
              className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition"
              placeholder="Contoh: Nasi Goreng Spesial"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">Price (Rp)</label>
              <input 
                required 
                type="number" 
                className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">Category</label>
              <select
                required
                className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Food">Food</option>
                <option value="Drink">Drink</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-5 py-3 rounded-xl font-semibold border border-[#5C321A]/20 hover:bg-[#E6DEC4]/20 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 px-5 py-3 rounded-xl font-semibold bg-[#96683E] text-white hover:bg-[#5C321A] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}