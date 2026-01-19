"use client" // Direktif ini tidak berpengaruh di Laravel + React, bisa dihapus jika mau

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { TooltipProps } from 'recharts';

// --- Tipe Data ---
interface Siswa {
  namaKelas: string;
  tingkatan: number;
  lakiSudahMemilih: number;
  totalLaki: number;
  perempuanSudahMemilih: number;
  totalPerempuan: number;
}

// --- Tooltip Kustom (dengan perbaikan typo) ---
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data: Siswa = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur-sm">
        <div className="mb-1 font-semibold">{label}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="text-muted-foreground">Male</div>
          <div className="font-medium">{data.lakiSudahMemilih} / {data.totalLaki}</div>
          <div className="text-muted-foreground">Female</div> 
          <div className="font-medium">{data.perempuanSudahMemilih} / {data.totalPerempuan}</div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Komponen Utama (dengan perbaikan) ---
export function DashboardPemilihanSiswa({ participationData }: { participationData: Siswa[] }) {
  const [tingkatan, setTingkatan] = React.useState('10');

  // Gunakan data dari props, bukan dari fungsi generator
  const dataTampil = participationData.filter(k => k.tingkatan === parseInt(tingkatan));

  // PERBAIKAN: Definisi warna harus ada di sini untuk digunakan oleh ChartContainer
  const chartConfig = {
    laki: { label: "Male", color: "hsl(225 45% 50%)" }, // Biru Batu Tulis (Slate)
    perempuan: { label: "Female", color: "hsl(220 10% 55%)" }, // Abu-abu Baja (Steel)
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-y-1.5">
          <CardTitle>Participation Rate</CardTitle>
          <CardDescription>The average number of voter participation</CardDescription>
        </div>
        <Select value={tingkatan} onValueChange={setTingkatan}>
          <SelectTrigger className="w-[150px] flex-shrink-0">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10th Grade</SelectItem>
            <SelectItem value="11">11th Grade</SelectItem>
            <SelectItem value="12">12th Grade</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <ChartContainer 
            config={chartConfig} 
            className="h-[250px] w-full"
            style={{ minWidth: dataTampil.length * 60 < 500 ? '100%' : dataTampil.length * 60 }}
          >
            <BarChart 
                data={dataTampil} 
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                barGap={4}
            >
              {/* DIHAPUS: Blok <defs> tidak diperlukan jika menggunakan warna solid */}
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="namaKelas"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.split('-')[1] || value}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted) / 0.3)', radius: 4 }} 
                content={<CustomTooltip />} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* PERBAIKAN: Menggunakan warna solid dari chartConfig */}
              <Bar dataKey="lakiSudahMemilih" name="Male" fill="var(--color-laki)" radius={4} />
              <Bar dataKey="perempuanSudahMemilih" name="Female" fill="var(--color-perempuan)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}