import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#EFE9D3]">
        {/* Menampilkan Sidebar yang kita buat tadi di sebelah kiri */}
        <AppSidebar />
        
        {/* Area Konten Halaman di sebelah kanan */}
        <main className="flex-1 w-full overflow-y-auto relative">
          {/* Tombol kecil melayang untuk menyembunyikan/memunculkan sidebar */}
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-[#FDFBF7] border border-[#9C6D44]/20 text-[#4A3525] hover:bg-[#EFE9D3]" />
          </div>
          
          {/* Isi halaman dashboard, menu, dsb */}
          <div className="pt-12">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}