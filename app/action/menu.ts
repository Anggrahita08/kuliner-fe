"use server"

import { getCookies } from "@/helper/cookies";

 // Sesuaikan path-nya

export async function saveMenuAction(dataMenu: any) {
  // 1. Ambil token dari cookies secara aman di sisi server
  const token = await getCookies("token_kuliner"); // Ganti "token_kuliner" sesuai nama key yang kamu pakai saat login

  // 2. Tembak ke API backend Railway temanmu
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Selipkan token Bearer di sini
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(dataMenu),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, message: errorText || "Gagal menyimpan menu" };
  }

  const result = await response.json();
  return { success: true, data: result };
}