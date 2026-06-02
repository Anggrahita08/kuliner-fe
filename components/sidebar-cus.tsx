'use client';

import { 
  LayoutDashboard, 
  User, 
  UtensilsCrossed, 
  CalendarCheck, 
  Users, 
  FileText, 
  CreditCard, 
  LogOut 
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCookies } from '@/helper/cookies';

export function CustomerSidebar() {
  const router = useRouter();
  
     const handleLogout = async () => {
      await deleteCookies("token_kuliner");
      router.push("/signin");
    };
  return (
    <Sidebar className="border-r border-[#9C6D44]/20 bg-[#FDFBF7]">
      <SidebarContent className="bg-[#FDFBF7]">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-[#9C6D44]/20">
          <h2 className="text-xl font-serif font-bold text-[#4A3525] tracking-wide">
            The Neighbourhood
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-[#9C6D44] font-sans font-semibold mt-1">
            Customer Portal
          </p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#4A3525]/50 font-sans text-xs font-bold uppercase tracking-wider px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              
              <SidebarMenuItem>
                <Link href="/customer/dashboard">
                  <SidebarMenuButton className="text-[#4A3525] hover:bg-[#EFE9D3]">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/customer/menu">
                  <SidebarMenuButton className="text-[#4A3525] hover:bg-[#EFE9D3]">
                    <UtensilsCrossed size={18} />
                    <span>Restaurant Menu</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/customer/booking">
                  <SidebarMenuButton className="text-[#4A3525] hover:bg-[#EFE9D3]">
                    <CalendarCheck size={18} />
                    <span>Booking Table</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/customer/reservationstatus">
                  <SidebarMenuButton className="text-[#4A3525] hover:bg-[#EFE9D3]">
                    <FileText size={18} />
                    <span>Reservation Status</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#FDFBF7] p-4 border-t border-[#9C6D44]/10">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors font-sans text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}