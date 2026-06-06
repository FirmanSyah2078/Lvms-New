"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import dashboard from '@/routes/dashboard'

// =================================================================
// 1. KOMPONEN UI DASAR (TABEL) - TEMP GELAP STANDAR
// =================================================================

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th 
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap",
        className
      )} 
      {...props} 
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
}

// =================================================================
// 2. IMPORT KOMPONEN YANG DIPERLUKAN
// =================================================================

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconX,
  IconServer,
  IconUser,
  IconClock,
  IconId,
  IconSchool,
  IconUserCircle,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// =================================================================
// 3. SCHEMA DAN KOMPONEN UNTUK TABLE ADVANCED - TEMP GELAP STANDAR
// =================================================================

const _schema = z.object({
  id: z.string(),
  fullName: z.string(),
  nis: z.string(),
  class: z.string(),
  time: z.string(),
  status: z.string(),
})

const columns: ColumnDef<z.infer<typeof _schema>>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <IconId className="size-4 text-foreground" />
        </div>
        <span className="text-foreground">No. Antrian</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted border">
          <IconUserCircle className="size-5 text-foreground" />
        </div>
        <div>
          <div className="font-mono font-bold text-foreground">
            {row.original.id}
          </div>
          <div className="text-xs text-muted-foreground">Antrian</div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <IconUser className="size-4 text-foreground" />
        </div>
        <span className="text-foreground">Data Siswa</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="font-semibold text-foreground truncate">
          {row.original.fullName}
        </div>
        <div className="text-sm text-muted-foreground">Nama Lengkap</div>
      </div>
    ),
  },
  {
    accessorKey: "nis",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <IconId className="size-4 text-foreground" />
        </div>
        <span className="text-foreground">NIS</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="font-mono font-medium text-foreground">
          {row.original.nis}
        </div>
        <div className="text-sm text-muted-foreground">Nomor Induk</div>
      </div>
    ),
  },
  {
  accessorKey: "class",
  header: () => (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-muted">
        <IconSchool className="size-4 text-foreground" />
      </div>
      <span className="text-foreground">Kelas</span>
    </div>
  ),
  cell: ({ row }) => {
    const classData = row.original.class.split(' ');
    const grade = classData[0];
    const major = classData.slice(1).join(' ');
    
    return (
      <div className="text-center">
        <div className="inline-flex items-stretch rounded-lg border border-border bg-card overflow-hidden shadow-sm min-w-[85px]">
          {/* Bagian Kelas */}
          <div className="flex items-center justify-center px-3 py-2 bg-primary/10 border-r border-border">
            <span className="font-bold text-primary text-sm">{grade}</span>
          </div>
          
          {/* Bagian Jurusan */}
          <div className="flex items-center justify-center px-3 py-2 bg-background">
            <span className="text-xs font-semibold text-foreground">{major}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Kelas - Jurusan</div>
      </div>
    )
  },
},
  {
    accessorKey: "time",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <IconClock className="size-4 text-foreground" />
        </div>
        <span className="text-foreground">Waktu</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">
          {row.original.time.split(', ')[1]}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.time.split(', ')[0]}
        </div>
        <div className="text-xs font-mono text-foreground font-bold">
          {row.original.time.split(', ')[2]}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <IconChartBar className="size-4 text-foreground" />
        </div>
        <span className="text-foreground">Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status
      let variant: "default" | "secondary" | "outline" | "destructive" = "outline"
      let icon = null
      
      if (status === "In Process") {
        variant = "default"
        icon = <IconCircleCheckFilled className="size-3" />
      } else if (status === "Finished") {
        variant = "secondary"
        icon = <IconCircleCheckFilled className="size-3" />
      } else if (status === "Called") {
        variant = "outline"
        icon = <IconCircleCheckFilled className="size-3" />
      } else if (status === "Not Present") {
        variant = "destructive"
        icon = <IconX className="size-3" />
      }
      
      return (
        <div className="rounded-xl border p-3 bg-card">
          <Badge variant={variant} className="gap-1 px-3 py-1.5 text-xs font-semibold mb-1">
            {icon}
            {status}
          </Badge>
          <div className="text-xs text-muted-foreground">Status Panggilan</div>
        </div>
      )
    },
  },
]

function AdvancedDataTable({
  data: initialData,
}: {
  data: z.infer<typeof _schema>[]
}) {
  const [data] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full">
      {/* Header Section - Simplified */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <IconUsers className="size-6 text-primary" />
            Data Antrian Siswa
          </h2>
          <p className="text-muted-foreground">Monitoring panggilan dan status kehadiran siswa secara real-time</p>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 border">
          <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap text-foreground">
            Baris per halaman
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20 h-8 bg-background border text-foreground" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-background border text-foreground">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-muted">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      colSpan={header.colSpan} 
                      className="whitespace-nowrap font-semibold text-foreground py-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/30 transition-all duration-200"
                  style={{
                    background: index % 2 === 0 
                      ? 'rgba(0, 0, 0, 0.02)' 
                      : 'transparent'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <IconUserCircle className="size-16 text-muted" />
                    <p className="text-lg">Tidak ada data siswa yang ditemukan.</p>
                    <p className="text-sm text-muted-foreground">Data akan muncul ketika ada siswa yang mendaftar</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 mt-6 p-4 rounded-xl bg-card border">
        <div className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{table.getRowModel().rows.length}</span> dari{" "}
          <span className="font-semibold text-foreground">{table.getRowCount()}</span> data siswa
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap text-foreground">
            Halaman <span className="font-bold text-foreground mx-1">{table.getState().pagination.pageIndex + 1}</span> dari{" "}
            <span className="font-bold text-foreground ml-1">{table.getPageCount()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="hidden h-9 w-9 p-0 lg:flex bg-background border text-foreground hover:bg-muted"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Pergi ke halaman pertama</span>
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-9 w-9 p-0 bg-background border text-foreground hover:bg-muted"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Pergi ke halaman sebelumnya</span>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-9 w-9 p-0 bg-background border text-foreground hover:bg-muted"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Pergi ke halaman berikutnya</span>
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-9 w-9 p-0 lg:flex bg-background border text-foreground hover:bg-muted"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Pergi ke halaman terakhir</span>
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =================================================================
// 4. KOMPONEN ROOM STATUS GRID - TEMP GELAP STANDAR
// =================================================================

function RoomStatusGrid({ data }: { data: { id: number; ipAddress: string; isOnline: boolean; operatorName: string }[] }) {
    return (
        <section>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((room) => (
                    <div key={room.id} className="border bg-card text-foreground rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        {/* Header dengan nomor ruang dan status online */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-xl text-foreground">
                                Ruang {room.id}
                            </h3>
                            <div className="flex items-center gap-1">
                                {room.isOnline ? (
                                    <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                        <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold text-green-600">Online</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                        <div className="size-2 bg-red-500 rounded-full"></div>
                                        <span className="text-xs font-semibold text-red-600">Offline</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Nama Pemilih/Operator */}
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-3 border">
                            <div className="p-2 rounded-lg bg-muted">
                                <IconUser className="size-4 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {room.operatorName || "Belum ada pemilih"}
                                </p>
                                <p className="text-xs text-muted-foreground">Nama Pemilih</p>
                            </div>
                        </div>
                        
                        {/* Alamat IP Device */}
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                            <div className="p-2 rounded-lg bg-muted">
                                <IconServer className="size-4 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-mono font-semibold text-foreground truncate">
                                    {room.ipAddress || "Tidak terdeteksi"}
                                </p>
                                <p className="text-xs text-muted-foreground">Alamat IP</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

// =================================================================
// 5. HALAMAN UTAMA CALLROOM - TEMP GELAP STANDAR
// =================================================================

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Callroom', href: dashboard.callroom().url },
]

function formatTimestamp(date: Date): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const dayName = days[date.getDay()]
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${dayName}, ${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`
}

export default function Callroom() {
    const roomData = [
        { id: 1, ipAddress: '192.168.1.101', isOnline: true, operatorName: 'Ahmad Santoso' },
        { id: 2, ipAddress: '192.168.1.102', isOnline: true, operatorName: 'Budi Wijaya' },
        { id: 3, ipAddress: '192.168.1.103', isOnline: false, operatorName: 'Citra Sari' },
        { id: 4, ipAddress: '192.168.1.104', isOnline: false, operatorName: 'Dewi Purnama' },
        { id: 5, ipAddress: '192.168.1.105', isOnline: true, operatorName: 'Eko Kusuma' },
        { id: 6, ipAddress: '192.168.1.106', isOnline: true, operatorName: 'Fitri Hidayat' },
        { id: 7, ipAddress: '192.168.1.107', isOnline: true, operatorName: 'Gunawan Nugroho' },
        { id: 8, ipAddress: '192.168.1.108', isOnline: false, operatorName: 'Hana Putri' },
    ]
    
    const generateQueueData = (count: number) => {
        const data = []
        const firstNames = ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gunawan', 'Hana', 'Indra', 'Joko']
        const lastNames = ['Santoso', 'Wijaya', 'Sari', 'Purnama', 'Kusuma', 'Hidayat', 'Nugroho', 'Putra', 'Lestari', 'Pratama']
        
        const classOptions = ['X IPA','X IPS', 'XI IPS','XI IPA', 'XII IPA', 'XII IPS']
        const statusOptions = ['In Process', 'Not Present', 'Finished', 'Called']
        
        const generateRandomDate = () => {
            const now = new Date()
            const past = new Date(now)
            past.setDate(now.getDate() - 7)
            
            const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime())
            return new Date(randomTime)
        }
        
        for (let i = 1; i <= count; i++) {
            const randomDate = generateRandomDate()
            const timeString = formatTimestamp(randomDate)
            
            data.push({
                id: `A${String(858 - i + 1).padStart(3, '0')}`,
                fullName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                nis: `NIS${String(2024000 + i).padStart(4, '0')}`,
                class: classOptions[Math.floor(Math.random() * classOptions.length)],
                time: timeString,
                status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
            })
        }
        return data
    }
    
    const queueData = generateQueueData(30)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Callroom" />
            
            <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
                
                
                {/* Room Status Grid - Langsung tampil tanpa Stats Overview */}
                <div className="flex-shrink-0">
                    <RoomStatusGrid data={roomData} />
                </div>
                
                {/* Data Table */}
                <div className="flex-1 min-h-0">
                    <div className="rounded-2xl bg-card">
                        <AdvancedDataTable data={queueData} />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}