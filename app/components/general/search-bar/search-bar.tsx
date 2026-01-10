import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

const SearchBar = (
  {
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
      <Input
        placeholder="Search transactions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-4 py-2.5 shadow-none bg-card border-border"
      />
    </div>
  );
}

export default SearchBar;