// File: components/pengawas/PengawasDataTable.tsx (PERBAIKAN)
import * as React from "react"
import { router } from '@inertiajs/react'
import {
    IconChevronLeft,
    IconChevronRight,
    IconLayoutColumns,
    IconSearch,
    IconCheck,
    IconX,
    IconTrash,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Peserta } from "@/types"

function ActionButtons({ peserta }: { peserta: Peserta }) {
    const handleAction = (action: 'absen' | 'hadir' | 'reset') => {
        const confirmationMessage = {
            absen: "Are you sure you want to mark this voter as 'absent'?",
            hadir: "Are you sure you want to mark this voter as 'present'?",
            reset: "Are you sure you want to reset this voter's attendance?",
        };

        if (confirm(confirmationMessage[action])) {
            router.post('/pengawas/action', { id: peserta.id, action }, {
                preserveScroll: true,
            });
        }
    };

    const hasVoted = peserta.status === 'Voted';
    const hasAbsen = peserta.sudah_absen;
    const hasHadir = peserta.sudah_hadir;

    return (
        <div className="flex justify-center gap-1">
            <Button
                variant={hasAbsen ? "secondary" : "outline"}
                size="sm"
                disabled={hasVoted || hasAbsen} // ✅ Disable jika sudah absen
                onClick={() => handleAction('absen')}
                className="h-8 px-2 text-xs"
            >
                <IconX className="h-3 w-3 mr-1" />
                Absent
            </Button>

            <Button
                variant={hasHadir ? "secondary" : "outline"}
                size="sm"
                disabled={hasVoted || hasHadir} // ✅ Disable jika sudah hadir
                onClick={() => handleAction('hadir')}
                className="h-8 px-2 text-xs"
            >
                <IconCheck className="h-3 w-3 mr-1" />
                Present
            </Button>

            <Button
                variant="outline"
                size="sm"
                disabled={!hasAbsen && !hasHadir} // ✅ Disable jika belum ada status kehadiran
                onClick={() => handleAction('reset')}
                className="h-8 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
                <IconTrash className="h-3 w-3 mr-1" />
                Reset
            </Button>
        </div>
    );
}

const columns: ColumnDef<Peserta>[] = [
    {
        id: "number",
        header: () => <div className="text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const rowIndex = row.index;
            return <div className="text-center font-medium">{pageIndex * pageSize + rowIndex + 1}</div>;
        },
    },
    {
        accessorKey: "nama_lengkap",
        header: "Full Name",
    },
    {
        accessorKey: "nis_nip",
        header: "NIS/NIP",
    },
    {
        accessorKey: "kategori",
        header: () => <div className="text-center">Category</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("kategori")}</div>,
    },
    {
        accessorKey: "no_antrian",
        header: () => <div className="text-center">Queue No.</div>,
        cell: ({ row }) => {
            const noAntrian = row.original.no_antrian;
            return (
                <div className="text-center font-semibold">
                    {noAntrian ? (
                        <span className="font-mono text-lg">{noAntrian}</span>
                    ) : (
                        <Badge variant="outline">Waiting</Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Vote Status</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <Badge variant={row.original.status === 'Voted' ? "default" : "secondary"} 
                      className={row.original.status === 'Voted' ? "bg-green-600 text-white" : ""}>
                    {row.original.status}
                </Badge>
            </div>
        ),
    },
    {
        id: "attendance",
        header: () => <div className="text-center">Attendance</div>,
        cell: ({ row }) => {
            const count = (row.original.sudah_absen ? 1 : 0) + (row.original.sudah_hadir ? 1 : 0);
            const total = 2;
            
            // ✅ Tampilkan badge berwarna berdasarkan progress
            let badgeVariant: "default" | "secondary" | "destructive" = "secondary";
            if (count === total) badgeVariant = "default";
            if (count === 0) badgeVariant = "destructive";
            
            return (
                <div className="text-center">
                    <Badge variant={badgeVariant} className={count === total ? "bg-green-600 text-white" : ""}>
                        {count}/{total}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionButtons peserta={row.original} />,
    },
]

export function PengawasDataTable({ data = [] }: { data: Peserta[] }) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState('')

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, columnFilters, pagination, globalFilter },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const columnDisplayNames: { [key: string]: string } = {
        nama_lengkap: "Full Name",
        nis_nip: "NIS/NIP",
        kategori: "Category",
        no_antrian: "Queue No.",
        status: "Vote Status",
        attendance: "Attendance",
    };

    return (
        <div className="w-full flex-col justify-start gap-4 space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="relative w-full max-w-sm">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                                <IconLayoutColumns className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {columnDisplayNames[column.id] || column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan} className="text-center">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="transition-colors hover:bg-muted/50">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell 
                                                key={cell.id} 
                                                className={
                                                    cell.column.id === 'nama_lengkap' || cell.column.id === 'nis_nip' 
                                                        ? "text-left" 
                                                        : "text-center"
                                                }
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-16" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 25, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="size-8 focus-visible:ring-0 focus-visible:ring-offset-0" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <IconChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="size-8 focus-visible:ring-0 focus-visible:ring-offset-0" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <IconChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}