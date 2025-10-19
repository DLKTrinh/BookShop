import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function BookSort() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-gray-200 bg-gray-800 border-gray-700">
                    Sort by
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuItem>Title (A–Z)</DropdownMenuItem>
                <DropdownMenuItem>Title (Z–A)</DropdownMenuItem>
                <DropdownMenuItem>Published Year (Ascending)</DropdownMenuItem>
                <DropdownMenuItem>Published Year (Descending)</DropdownMenuItem>
                <DropdownMenuItem>Author</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
