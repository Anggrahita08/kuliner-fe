"use client";

import { deleteCookies } from "@/helper/cookies";
import { SidebarMenuButton } from "./ui/sidebar";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "./ui/alert-dialog";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const handleLogout = async () => {
        await deleteCookies("token");
        // Gunakan path yang sesuai dengan routing kamu, 
        // jika halaman login di (auth)/login, gunakan /login
        window.location.href = "/login"; 
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SidebarMenuButton className="text-[#96683E] hover:bg-[#96683E]/10 hover:text-[#5C321A] transition">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#FDFBF7] border border-[#5C321A]/20">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#5C321A]">Yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#5C321A]/70">
                        Anda harus login kembali untuk mengakses akun Anda.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="border-[#5C321A]/20 hover:bg-[#E6DEC4]">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleLogout}
                        className="bg-[#96683E] hover:bg-[#5C321A] text-white"
                    >
                        Ya, Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}