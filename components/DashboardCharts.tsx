'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// 1. Konfigurasi Warna & Label ala Shadcn UI
const chartConfig = {
  pendapatan: {
    label: 'Pendapatan',
    color: 'hsl(var(--chart-1))',
  },
  performa: {
    label: 'Skor Performa',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Data Mockup
const dataPendapatan = [
  { bulan: 'Jan', pendapatan: 12000000 },
  { bulan: 'Feb', pendapatan: 15000000 },
  { bulan: 'Mar', pendapatan: 18000000 },
  { bulan: 'Apr', pendapatan: 14000000 },
  { bulan: 'Mei', pendapatan: 23000000 },
];

const dataPegawai = [
  { nama: 'Ahmad', performa: 95 },
  { nama: 'Siti', performa: 88 },
  { nama: 'Budi', performa: 82 },
  { nama: 'Dewi', performa: 79 },
  { nama: 'Rian', performa: 75 },
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      {/* CHART PENDAPATAN (LINE CHART) */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Pendapatan</CardTitle>
          <CardDescription>Total pemasukan restoran 5 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={dataPendapatan} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `Rp${v/1000000}M`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="pendapatan" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* CHART PEGAWAI TERBAIK (BAR CHART) */}
      <Card>
        <CardHeader>
          <CardTitle>Pegawai Terbaik Bulan Ini</CardTitle>
          <CardDescription>Berdasarkan rating ulasan & orderan selesai</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={dataPegawai} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="nama" type="category" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="performa" fill="hsl(var(--chart-2))" radius={5} barSize={20} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}