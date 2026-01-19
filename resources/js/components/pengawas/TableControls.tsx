// File: TableControls.tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Props {
    filter: string;
    setFilter: (filter: string) => void;
}

export default function TableControls({ filter, setFilter }: Props) { // ✅ HAPUS searchTerm dan setSearchTerm
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <ToggleGroup
                type="single"
                value={filter}
                onValueChange={(value) => {
                    if (value) setFilter(value);
                }}
                className="justify-start"
            >
                <ToggleGroupItem value="all">All</ToggleGroupItem>
                <ToggleGroupItem value="pelajar">Students</ToggleGroupItem>
                <ToggleGroupItem value="guru">Teachers</ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}