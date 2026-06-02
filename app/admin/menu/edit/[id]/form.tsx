/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

// Interface sesuai dengan response API
interface MenuData {
    id: number;
    name: string;
    category: string;
    price: number;
    image: any;
    description: any;
    createdAt: string;
    updatedAt: string;
}

type Props = {
    menu: MenuData;
};

export default function FormMenu(props: Props) {
    const [name, setName] = useState<string>(props.menu.name);
    const [price, setPrice] = useState<number>(props.menu.price);
    const [category, setCategory] = useState<string>(props.menu.category || "Food");
    const [isLoading, setIsLoading] = useState(false);
    
    const id = props.menu.id;
    const router = useRouter();

    async function handleUpdateMenu(e: React.FormEvent) {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("Menu name is required");
            return;
        }
        
        if (!price || price <= 0) {
            toast.error("Price must be valid and greater than 0");
            return;
        }
        
        if (!category) {
            toast.error("Category is required");
            return;
        }
        
        setIsLoading(true);

        try {
            const token = await getCookies("token_kuliner");
            const baseUrl = "https://be-kuliner-production.up.railway.app";

            const requestBody = {
                name,
                price: Number(price),
                category
            };
            
            const response = await fetch(`${baseUrl}/menu/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                toast.error(responseData.message || "Failed to update menu");
                return;
            }
            
            toast.success("Menu updated successfully!");
            router.push("/admin/menu");
            
        } catch (error) {
            console.error("Error updating menu:", error);
            toast.error("Connection error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-8 bg-[#FDFBF7] min-h-screen text-[#5C321A]">
            <div className="max-w-xl mx-auto mb-8">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-center">Edit Menu</h1>
                <p className="text-[#5C321A]/70 mt-2 text-center">Update menu item information</p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-[#5C321A]/10 shadow-sm">
                <form onSubmit={handleUpdateMenu} className="space-y-6">
                    {/* Menu Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">
                            Menu Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition"
                            placeholder="Contoh: Nasi Goreng Spesial"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Price and Category Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">
                                Price (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                required 
                                type="number" 
                                className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition"
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#5C321A]/80">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                className="w-full bg-[#E6DEC4]/10 border border-[#5C321A]/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#96683E]/20 transition appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Food">Food</option>
                                <option value="Drink">Drink</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => router.push("/admin/menu")}
                            className="flex-1 px-5 py-3 rounded-xl font-semibold border border-[#5C321A]/20 hover:bg-[#E6DEC4]/20 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-5 py-3 rounded-xl font-semibold bg-[#96683E] text-white hover:bg-[#5C321A] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Updating..." : "Update Menu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}