import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerSidebar } from '@/components/sidebar-cus'; // Pastikan path import sesuai

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#FDFBF7]">
        {/* Sidebar khusus Customer */}
        <CustomerSidebar />
        
        {/* Area Konten */}
        <main className="flex-1 w-full overflow-y-auto relative">
          {/* Tombol Sidebar */}
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white border border-[#5C321A]/20 text-[#5C321A] hover:bg-[#E6DEC4]/20" />
          </div>
          
          {/* Isi halaman (Dashboard, Order, Booking, dsb) */}
          <div className="pt-16 px-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}