"use client";

import { useState } from "react";
import { getCookies } from "@/helper/cookies";

export default function Dropmenu({ id, onRefresh }: { id: number | string, onRefresh: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    setIsDeleting(true);
    try {
      const token = await getCookies("token_kuliner");
      
      // Log the request details for debugging
      console.log("Deleting menu with ID:", id);
      console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`);
      console.log("Token exists:", !!token);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // Add this header
        },
      });

      // Get response text for better error handling
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      if (response.ok) {
        let result;
        try {
          result = JSON.parse(responseText);
        } catch(e) {
          result = { message: responseText };
        }
        alert(result.message || "Menu berhasil dihapus!");
        onRefresh(); // Refresh the table after delete
      } else {
        // Parse error message if available
        let errorMessage = "Gagal menghapus menu: Server menolak permintaan.";
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.error || errorMessage;
        } catch(e) {
          // If response isn't JSON, use status text
          if (response.status === 401) errorMessage = "Unauthorized: Silakan login kembali.";
          if (response.status === 403) errorMessage = "Forbidden: Anda tidak memiliki izin.";
          if (response.status === 404) errorMessage = "Menu tidak ditemukan.";
          if (response.status === 500) errorMessage = "Server error: Silakan coba lagi nanti.";
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan koneksi. Periksa network console untuk detail.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}