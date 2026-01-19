import * as React from "react"
import { router } from '@inertiajs/react'
import {
    IconCalendarOff,
    IconChevronLeft,
    IconChevronRight,
    IconClockHour8,
    IconDotsVertical,
    IconEye,
    IconEyeOff,
    IconFilter,
    IconLayoutColumns,
    IconPlus,
    IconRotate2,
    IconRotateClockwise,
    IconSearch,
    IconUserCheck,
    IconUserOff,
    IconX,
} from "@tabler/icons-react"
import {
    Cell,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const voterSchema = z.object({
    id: z.number(),
    name: z.string(),
    nis_nip: z.string(),
    class: z.string(),
    gender: z.string(),
    morning_attendance_at: z.string().nullable(),
    voting_attendance_at: z.string().nullable(),
    has_voted: z.boolean(),
    voted_at: z.string().nullable(),
    plain_text_password: z.string(),
    queue_number: z.number().nullable(),
});

type Voter = z.infer<typeof voterSchema>;

function PasswordCell({ value }: { value: string }) {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{isVisible ? value : '••••••••'}</span>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                <span className="sr-only">Toggle password visibility</span>
            </Button>
        </div>
    );
}

function VoterEditDrawer({ voter }: { voter: Voter }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground h-auto p-0 font-semibold text-left hover:underline focus-visible:ring-0 focus-visible:ring-offset-0">
                    {voter.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-md">
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Edit: {voter.name}</DrawerTitle>
                    <DrawerDescription>
                        Perbarui informasi pemilih. Klik "Save" untuk menyimpan.
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-4">
                    <DrawerFooter className="mt-auto p-0 pt-4">
                        <Button type="submit">Save Changes</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

export function VotersDataTable({ data = [], missingQueueNumbers = [], categories = [] }: { data: Voter[]; missingQueueNumbers: number[]; categories: string[] }) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState('')

    const [selectedVoter, setSelectedVoter] = React.useState<Voter | null>(null);
    const [selectedQueueNumber, setSelectedQueueNumber] = React.useState<string>("");

    const handleReassign = React.useCallback(() => {
        if (selectedVoter && selectedQueueNumber) {
            router.post(`/dashboard/database/${selectedVoter.id}/reassign-queue`, {
                queue_number: selectedQueueNumber
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    document.getElementById('close-reassign-dialog')?.click();
                }
            });
        }
    }, [selectedVoter, selectedQueueNumber]);
    
    const columns = React.useMemo<ColumnDef<Voter>[]>(() => [
        {
            id: "number",
            header: () => <div className="text-center">#</div>,
            cell: ({ row, table }) => {
                const pageIndex = (table.getState().pagination.pageIndex);
                const pageSize = table.getState().pagination.pageSize;
                const rowIndex = row.index;
                return <div className="text-center font-medium">{pageIndex * pageSize + rowIndex + 1}</div>;
            },
        },
        {
            accessorKey: "name",
            header: "Complete Name",
            cell: ({ row }) => <VoterEditDrawer voter={row.original} />,
        },
        {
            accessorKey: "nis_nip",
            header: "NIP/NIS",
        },
        {
            accessorKey: "gender",
            header: () => <div className="text-center">Gender</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("gender")}</div>,
        },
        {
            accessorKey: "class",
            header: () => <div className="text-center">Kategori</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("class")}</div>,
        },
        {
            accessorKey: "plain_text_password",
            header: "Password",
            cell: ({ row }) => <PasswordCell value={row.original.plain_text_password} />,
        },
        {
            accessorKey: "queue_number",
            header: () => <div className="text-center">Queue No.</div>,
            cell: ({ row }) => {
                const queueNumber = row.original.queue_number;
                return (
                    <div className="text-center font-semibold">
                        {queueNumber ? (
                            <span className="font-mono text-lg">{queueNumber}</span>
                        ) : (
                            <Badge variant="outline">Menunggu</Badge>
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "has_voted",
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={row.original.has_voted ? "default" : "secondary"} className={row.original.has_voted ? "bg-green-600 text-white" : ""}>
                        {row.original.has_voted ? "Voted" : "Process"}
                    </Badge>
                </div>
            ),
        },
        {
            id: "attendance",
            header: () => <div className="text-center">Attendance</div>,
            cell: ({ row }) => {
                const morning = !!row.original.morning_attendance_at;
                const voting = !!row.original.voting_attendance_at;
                const count = (morning ? 1 : 0) + (voting ? 1 : 0);
                return <div className="text-center font-mono font-semibold">{count}/2</div>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const voter = row.original;
                const hasVoted = voter.has_voted;
                const hasMorningAttendance = !!voter.morning_attendance_at;
                const hasVotingAttendance = !!voter.voting_attendance_at;
                const canReassign = missingQueueNumbers.length > 0 && !voter.has_voted && !voter.queue_number;

                return (
                    <div className="flex justify-center">
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    size="icon"
                                >
                                    <IconDotsVertical className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <DropdownMenuItem
                                    disabled={hasMorningAttendance}
                                    onSelect={() => router.post(`/dashboard/database/${voter.id}/mark-morning-attendance`, {}, { preserveScroll: true })}
                                >
                                    <IconClockHour8 className="mr-2 h-4 w-4" />
                                    <span>Mark Morning Attendance</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    disabled={hasVotingAttendance}
                                    onSelect={() => router.post(`/dashboard/database/${voter.id}/mark-voting-attendance`, {}, { preserveScroll: true })}
                                >
                                    <IconUserCheck className="mr-2 h-4 w-4" />
                                    <span>Mark Voting Attendance</span>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        disabled={!canReassign}
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setSelectedVoter(voter);
                                            setSelectedQueueNumber(missingQueueNumbers[0]?.toString() || "");
                                        }}
                                    >
                                        <IconRotate2 className="mr-2 h-4 w-4" />
                                        <span>Re-assign Skipped Queue</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                
                                <DropdownMenuItem
                                    disabled={!hasVoted}
                                    onSelect={() => router.post(`/dashboard/database/${voter.id}/reset-voting`, {}, { preserveScroll: true })}
                                >
                                    <IconRotateClockwise className="mr-2 h-4 w-4" />
                                    <span>Reset Voting</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    disabled={hasVoted || (!hasMorningAttendance && !hasVotingAttendance)}
                                    onSelect={() => router.post(`/dashboard/database/${voter.id}/reset-attendance`, {}, { preserveScroll: true })}
                                >
                                    <IconCalendarOff className="mr-2 h-4 w-4" />
                                    <span>Reset Attendance</span>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                    onSelect={() => {
                                        if (confirm(`Are you sure you want to delete ${voter.name}?`)) {
                                            router.delete(`/dashboard/database/${voter.id}`, { preserveScroll: true });
                                        }
                                    }}
                                >
                                    <IconUserOff className="mr-2 h-4 w-4" />
                                    <span>Delete Account</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Re-assign Skipped Queue Number</DialogTitle>
                                <DialogDescription>
                                    This voter has not been present. Select one of the skipped queue numbers to assign to them.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Voter Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={selectedVoter?.name || ''}
                                        readOnly
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="queue_number" className="text-right">
                                        Skipped No.
                                    </Label>
                                    <Select value={selectedQueueNumber} onValueChange={setSelectedQueueNumber}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a skipped number" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {missingQueueNumbers.map(num => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button id="close-reassign-dialog" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleReassign}>Assign Number</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    </div>
                )
            },
        },
    ], [missingQueueNumbers, selectedQueueNumber, selectedVoter, handleReassign]);

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
    
    const categoryFilterValue = table.getColumn("class")?.getFilterValue() as string ?? "";

    const columnDisplayNames: { [key: string]: string } = {
        nis_nip: "NIP/NIS",
        class: "Kategori",
        plain_text_password: "Password",
        queue_number: "Queue No.",
        has_voted: "Status",
        attendance: "Attendance",
        name: "Complete Name",
        gender: "Gender",
    };

    return (
        <div className="w-full flex-col justify-start gap-4 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-auto md:flex-1">
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search all columns..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10 w-full md:max-w-xs"
                        />
                    </div>
                </div>

                <div className="flex w-full md:w-auto items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <IconFilter className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Kategori</span>
                                {categoryFilterValue && (
                                    <>
                                        <div className="mx-2 h-4 w-px bg-border" />
                                        <Badge variant="secondary" className="rounded-sm px-1.5 font-normal lg:hidden">
                                            1
                                        </Badge>
                                        <Badge variant="secondary" className="hidden rounded-sm px-1.5 font-normal lg:block">
                                            {categoryFilterValue}
                                        </Badge>
                                    </>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-h-[200px] overflow-y-auto">
                            {categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={categoryFilterValue === category}
                                    onSelect={() => {
                                        const currentFilter = table.getColumn("class")?.getFilterValue();
                                        if (currentFilter === category) {
                                            table.getColumn("class")?.setFilterValue(undefined);
                                        } else {
                                            table.getColumn("class")?.setFilterValue(category);
                                        }
                                    }}
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}
                            {categoryFilterValue && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:bg-red-50"
                                        onSelect={() => table.getColumn("class")?.setFilterValue(undefined)}
                                    >
                                        <IconX className="mr-2 h-4 w-4" />
                                        Reset Filter
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <IconLayoutColumns className="mr-0 sm:mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
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
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="default" size="sm" className="h-9">
                        <IconPlus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Add Voter</span>
                    </Button>
                </div>
            </div>


            <div className="overflow-hidden rounded-md border">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const columnWidths: { [key: string]: string } = {
                                            number: "w-[50px]",
                                            name: "min-w-[250px]",
                                            nis_nip: "w-[120px]",
                                            gender: "w-[100px]",
                                            class: "w-[160px]",
                                            plain_text_password: "w-[140px]",
                                            queue_number: "w-[120px]",
                                            has_voted: "w-[120px]",
                                            attendance: "w-[120px]",
                                            actions: "w-[80px]",
                                        };
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan}
                                                className={columnWidths[header.column.id] || ""}
                                            >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row: Row<Voter>) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="transition-colors hover:bg-muted/50" >
                                        {row.getVisibleCells().map((cell: Cell<Voter, unknown>) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center" >
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
                        <Label htmlFor="rows-per-page" className="text-sm font-medium sr-only sm:not-sr-only">
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
                        <Button variant="outline" className="size-8 focus-visible:ring-0 focus-visible:ring-offset-0" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} >
                            <span className="sr-only">Previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button variant="outline" className="size-8 focus-visible:ring-0 focus-visible:ring-offset-0" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} >
                            <span className="sr-only">Next page</span>
                            <IconChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}