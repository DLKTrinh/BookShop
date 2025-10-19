import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function BookFilter() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-gray-200 bg-gray-800 border-gray-700">
                    Filter by
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Fiction</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Programming</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Science</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Fantasy</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
