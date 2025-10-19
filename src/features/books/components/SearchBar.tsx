import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search books..."
        className="pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
      />
    </div>
  )
}
